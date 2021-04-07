const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("config");
const fs = require("fs");

aws.config.update({
  secretAccessKey: config.get("S3_SECRET_KEY"),
  accessKeyId: config.get("S3_ACCESS_KEY"),
});

const spacesEndpoint = new aws.Endpoint("sfo2.digitaloceanspaces.com");
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

// const s3 = new aws.S3();

var myBucket = config.get("S3_BUCKET_NAME");

const uploadFileS3 = function (filePath, key, folderName) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, function (err, data) {
      if (err) {
        throw err;
      }
      console.log("Bucket Name: ", myBucket + "/" + folderName);
      params = { Bucket: myBucket + "/" + folderName, Key: key, Body: data, ACL: "public-read" };

      s3.putObject(params, function (err, data) {
        if (err) {
          console.log(err);
          reject(new Error("Image upload failed"));
        } else {
          console.log("Successfully uploaded data to myBucket/myKey");
          resolve();
        }
      });
    });
  });
};

const uploadDirectFileS3 = function (key, folderName, data) {
  return new Promise((resolve, reject) => {
    params = { Bucket: myBucket + "/" + folderName, Key: key, Body: data, ACL: "public-read" };

    console.log("Params: ", params);
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(new Error("Image upload failed"));
      }
      resolve();
    });
  });
};

const deleteFileS3 = function (url) {
  let tempKey = url.split(".com/");
  let key = tempKey[1];
  return new Promise((resolve, reject) => {
    params = { Bucket: myBucket, Key: key };

    // console.log("Params: ", params);
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(new Error("Object delete failed"));
      } else {
        resolve();
      }
    });
  });
};

module.exports.uploadFileS3 = uploadFileS3;
module.exports.uploadDirectFileS3 = uploadDirectFileS3;
module.exports.deleteFileS3 = deleteFileS3;
