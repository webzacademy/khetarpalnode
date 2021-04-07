const { MANUFACTURER_CONSTANTS } = require("../config/constant.js");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { userAdminAuth, adminAuth } = require("../middleware/auth");
const _ = require("lodash");
const {
  Manufacturer,
  validateManufacturerPost,
  validateManufacturerPut,
  validateManufacturerGet,
} = require("../models/manufacturer");
//-------------------------------------------------------------------------------------------------------
//create manufacturer
router.post("/", adminAuth, async (req, res) => {
  const { error } = validateManufacturerPost(req.body);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });

  let manufacturer = new Manufacturer(
    _.pick(req.body, [
      "name",
      "type",
      "address",
      "contactName",
      "contactEmail",
      "phone",
      "weChatId",
      "country",
      "finalVersion",
      "city",
      "zipCode",
      "state",
      "website",
    ])
  );
  manufacturer.nameRegex = req.body.name.toLowerCase();
  manufacturer.status = "active";
  try {
    await manufacturer.save();
  } catch (Ex) {
    if (Ex.code === 11000)
      return res
        .status(400)
        .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.DUPLICATE_PRODUCT });
    else
      return res.status(400).send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.SYSTEM_FAILURE });
  }

  return res.send({ statusCode: 200, message: "Success", data: MANUFACTURER_CONSTANTS.SUBMIT_SUCCESS });
});

//update manufacturer
router.put("/", adminAuth, async (req, res) => {
  // const { error } = validateManufacturerPut(req.body);
  // if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });

  if (req.body.primary) {
    let manufacturer = await Manufacturer.findById(req.body.primary.manufacturerId);
    if (!manufacturer) {
      return res
        .status(400)
        .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.INVALID_Manufacturer_ID });
    }

    if (req.body.primary.name != manufacturer.name) {
      manufacturer.name = req.body.primary.name || manufacturer.name;
      manufacturer.nameRegex = req.body.primary.name.toLowerCase();
    }

    manufacturer.type = req.body.primary.type || manufacturer.type;
    manufacturer.address = req.body.primary.address || manufacturer.address;
    manufacturer.contactName = req.body.primary.contactName || manufacturer.contactName;
    manufacturer.contactEmail = req.body.primary.contactEmail || manufacturer.contactEmail;
    manufacturer.phone = req.body.primary.phone || manufacturer.phone;
    manufacturer.weChatId = req.body.primary.weChatId || manufacturer.weChatId;
    manufacturer.country = req.body.primary.country || manufacturer.country;
    manufacturer.finalVersion = req.body.primary.finalVersion || manufacturer.finalVersion;
    manufacturer.city = req.body.primary.city || manufacturer.city;
    manufacturer.state = req.body.primary.state || manufacturer.state;
    manufacturer.website = req.body.primary.website || manufacturer.website;
    manufacturer.zipCode = req.body.primary.zipCode || manufacturer.zipCode;
    try {
      await manufacturer.save();
    } catch (Ex) {
      if (Ex.code === 11000)
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.DUPLICATE_PRODUCT });
      else
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.SYSTEM_FAILURE });
    }
  }

  if (req.body.secondary) {
    let manufacturer = await Manufacturer.findById(req.body.secondary.manufacturerId);
    if (!manufacturer) {
      return res
        .status(400)
        .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.INVALID_Manufacturer_ID });
    }

    if (req.body.secondary.name != manufacturer.name) {
      manufacturer.name = req.body.secondary.name || manufacturer.name;
      manufacturer.nameRegex = req.body.secondary.name.toLowerCase();
    }

    manufacturer.type = req.body.secondary.type || manufacturer.type;
    manufacturer.address = req.body.secondary.address || manufacturer.address;
    manufacturer.contactName = req.body.secondary.contactName || manufacturer.contactName;
    manufacturer.contactEmail = req.body.secondary.contactEmail || manufacturer.contactEmail;
    manufacturer.phone = req.body.secondary.phone || manufacturer.phone;
    manufacturer.weChatId = req.body.secondary.weChatId || manufacturer.weChatId;
    manufacturer.country = req.body.secondary.country || manufacturer.country;
    manufacturer.finalVersion = req.body.secondary.finalVersion || manufacturer.finalVersion;
    try {
      await manufacturer.save();
    } catch (Ex) {
      if (Ex.code === 11000)
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.DUPLICATE_PRODUCT });
      else
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.SYSTEM_FAILURE });
    }
  }

  if (req.body.formulation) {
    let manufacturer = await Manufacturer.findById(req.body.formulation.manufacturerId);
    if (!manufacturer) {
      return res
        .status(400)
        .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.INVALID_Manufacturer_ID });
    }

    if (req.body.formulation.name != manufacturer.name) {
      manufacturer.name = req.body.formulation.name || manufacturer.name;
      manufacturer.nameRegex = req.body.formulation.name.toLowerCase();
    }

    manufacturer.type = req.body.formulation.type || manufacturer.type;
    manufacturer.address = req.body.formulation.address || manufacturer.address;
    manufacturer.contactName = req.body.formulation.contactName || manufacturer.contactName;
    manufacturer.contactEmail = req.body.formulation.contactEmail || manufacturer.contactEmail;
    manufacturer.phone = req.body.formulation.phone || manufacturer.phone;
    manufacturer.weChatId = req.body.formulation.weChatId || manufacturer.weChatId;
    manufacturer.country = req.body.formulation.country || manufacturer.country;
    manufacturer.finalVersion = req.body.formulation.finalVersion || manufacturer.finalVersion;
    try {
      await manufacturer.save();
    } catch (Ex) {
      if (Ex.code === 11000)
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.DUPLICATE_PRODUCT });
      else
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.SYSTEM_FAILURE });
    }
  }
  if (req.body.label) {
    let manufacturer = await Manufacturer.findById(req.body.formulation.manufacturerId);
    if (!manufacturer) {
      return res
        .status(400)
        .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.INVALID_Manufacturer_ID });
    }

    if (req.body.formulation.name != manufacturer.name) {
      manufacturer.name = req.body.formulation.name || manufacturer.name;
      manufacturer.nameRegex = req.body.formulation.name.toLowerCase();
    }

    manufacturer.type = req.body.formulation.type || manufacturer.type;
    manufacturer.address = req.body.formulation.address || manufacturer.address;
    manufacturer.contactName = req.body.formulation.contactName || manufacturer.contactName;
    manufacturer.contactEmail = req.body.formulation.contactEmail || manufacturer.contactEmail;
    manufacturer.phone = req.body.formulation.phone || manufacturer.phone;
    manufacturer.weChatId = req.body.formulation.weChatId || manufacturer.weChatId;
    manufacturer.country = req.body.formulation.country || manufacturer.country;
    manufacturer.finalVersion = req.body.formulation.finalVersion || manufacturer.finalVersion;
    try {
      await manufacturer.save();
    } catch (Ex) {
      if (Ex.code === 11000)
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.DUPLICATE_PRODUCT });
      else
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: MANUFACTURER_CONSTANTS.SYSTEM_FAILURE });
    }
  }
  if (req.body.primary.manufacturerId) {
    var primary = await Manufacturer.findById(req.body.primary.manufacturerId);
  }

  if (req.body.secondary.manufacturerId) {
    var secondary = await Manufacturer.findById(req.body.secondary.manufacturerId);
  }

  if (req.body.formulation.manufacturerId) {
    var formulation = await Manufacturer.findById(req.body.formulation.manufacturerId);
  }
  return res.send({ statusCode: 200, message: "Success", data: { primary, secondary, formulation } });
});

//get manufacturers
router.get("/", userAdminAuth, async (req, res) => {
  const { error } = validateManufacturerGet(req.query);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });

  var skipVal, limitVal;
  if (isNaN(parseInt(req.query.offset))) skipVal = 0;
  else skipVal = parseInt(req.query.offset);

  if (isNaN(parseInt(req.query.limit))) limitVal = 50;
  else limitVal = parseInt(req.query.limit);
  let criteria = {};
  if (req.query.type) {
    criteria.type = req.query.type;
  }

  if (req.query.name) {
    var regexName = new RegExp("^" + req.query.name + ".*", "i");
    criteria.nameRegex = { $regex: regexName };
  }
  // console.log(criteria);
  let manufacturerList = await Manufacturer.aggregate([
    { $match: criteria },
    { $sort: { insertDate: -1 } },
    { $skip: skipVal },
    { $limit: limitVal },
    {
      $project: {
        _id: 0,
        type: 1,
        manufacturerId: "$_id",
        name: 1,
        address: 1,
        contactName: 1,
        contactEmail: 1,
        phone: 1,
        weChatId: 1,
        country: 1,
        finalVersion: 1,
        website: 1,
        city: 1,
        zipCode: 1,
        country: 1,
        state: 1,
      },
    },
  ]);
  return res.send({ statusCode: 200, message: "Success", data: { manufacturerList } });
});

//delete manufacturer
router.delete("/:id", adminAuth, async (req, res) => {
  let product = await Product.deleteOne({ _id: req.params.id });
  if (product.deletedCount) {
    return res.send({ statusCode: 200, message: "Success", data: "Product Deleted Successfully" });
  } else {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: "Product Id not found" });
  }
});

module.exports = router;
