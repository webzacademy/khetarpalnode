const { SYSTEM_FAILURE } = require("../config/constant.js");
const express = require("express");
const config = require("config");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const gm = require("gm").subClass({ imageMagick: true });

// For Saving on disk first
const upload = multer({ dest: "./images/uploaded/" });
const singleUpload = upload.single("image");

// For saving directly on S3
var storage = multer.memoryStorage();
var uploadDirect = multer({ storage: storage });
// ateli - yay.sfo2.digitaloceanspaces.com;

const FileUrl = "https://ateli-yay.sfo2.digitaloceanspaces.com/";
const { uploadDirectFileS3, deleteFileS3 } = require("../services/s3Upload");

router.post(
  "/image-upload",
  uploadDirect.single("image"),
  async function (req, res) {
    const dateString = Date.now();
    const Key = dateString + "_" + req.file.originalname;
    var url = FileUrl + "yay/" + Key;

    res.status(200).contentType("text/plain").send({
      statusCode: 200,
      message: "Success",
      data: {
        url,
      },
    });

    try {
      await uploadDirectFileS3(Key, "yay", req.file.buffer);
    } catch (Ex) {
      console.log("Exception: ", Ex.message);
      return handleError(Ex, res);
    }
  }
);

router.post(
  "/multipalImage-upload",
  uploadDirect.array("image"),
  async function (req, res) {
    const dateString = Date.now();
    try {
      let urlArray = [];
      req.files.map(async (item) => {
        let filekey = dateString + "_" + item.originalname;
        var url = FileUrl + "yay/" + filekey;
        urlArray.push(url);
        await uploadDirectFileS3(filekey, "yay", item.buffer);
      });
      return res.status(200).send({
        statusCode: 200,
        message: "Success",
        data: [...urlArray],
      });
    } catch (Ex) {
      console.log("Exception: ", Ex.message);
      return handleError(Ex, res);
    }
  }
);

router.delete("/delete/url", async (req, res) => {
  if (!req.body.url) {
    return res
      .status(400)
      .send({ statusCode: 400, message: "Failure", data: "Url is required" });
  }
  try {
    await deleteFileS3(req.body.url);
    res
      .status(200)
      .contentType("text/plain")
      .send({
        statusCode: 200,
        message: "Success",
        data: {
          data: "File deleted Successfully",
        },
      });
  } catch (Ex) {
    console.log("Exception: ", Ex.message);
    return handleError(Ex, res);
  }
});

const handleError = (err, res) => {
  console.log(err);
  res.status(500).contentType("text/plain").end(SYSTEM_FAILURE);
};

module.exports = router;
