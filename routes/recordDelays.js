const { PRODUCTION_CONSTANTS } = require("../config/constant.js");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth");
const _ = require("lodash");
const { Production } = require("../models/production");
const { User } = require("../models/user");
const { Product } = require("../models/product");
const { Activity } = require("../models/activity");
const { sendDelayMail } = require("../services/sendMail");
const formatter = require("../services/commonFunctions");
const { RecordDelay, validateRecordPost, validateRecordPut } = require("../models/recordDelay");

router.post("/", adminAuth, async (req, res) => {
  const { error } = validateRecordPost(req.body);
  if (error) return res.status(400).send({ statusCode: 400, status: "Failure", data: error.details[0].message });

  let production = await Production.findById(req.body.productionId);
  if (!production) {
    return res.status(400).send({ statusCode: 400, status: "Failure", data: PRODUCTION_CONSTANTS.INVALID_ID });
  }
  let user = await User.findOne({ _id: production.userId });
  let product = await Product.findOne({ _id: production.productId });
  let recordDelay = await RecordDelay.findOne({
    productionId: req.body.productionId,
    productType: req.body.productType,
    packagingType: req.body.packagingType,
  });
  if (!recordDelay) {
    recordDelay = new RecordDelay(_.pick(req.body, ["productionId", "productType", "days", "reason", "packagingType"]));
  } else {
    recordDelay.productType = req.body.productType;
    recordDelay.packagingType = req.body.packagingType;
    recordDelay.time = req.body.time;
    recordDelay.days = req.body.days;
    recordDelay.reason = req.body.reason;
  }
  production.productStatus = "delayed";
  await production.save();
  await recordDelay.save();
  if (recordDelay.packagingType == "primary") {
    product.productionTime += req.body.days;
    await product.save();
    await Activity.create({
      userId: production.userId,
      productId: production.productId,
      days: req.body.days,
      type: "primaryDelayed",
      newDate: product.insertDate * 1000 + (product.productionTime + parseInt(req.body.days)) * 24 * 60 * 60 * 1000,
    });

    let emailData = {
      email: user.email,
      userName: user.fullName,
      productName: product.name,
      component: "primary packaging",
      reason: recordDelay.reason,
      subject: config.get("email.delayTitle"),
    };
    let result = await sendDelayMail(emailData);
    if (result.code) {
      return res
        .status(500)
        .send({ message: "Failure", statusCode: 500, data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE });
    }
  }

  if (recordDelay.packagingType == "secondary") {
    product.productionTime += req.body.days;
    await product.save();
    await Activity.create({
      userId: production.userId,
      productId: production.productId,
      days: req.body.days,
      type: "secondaryDelayed",
      newDate: product.insertDate * 1000 + (product.productionTime + parseInt(req.body.days)) * 24 * 60 * 60 * 1000,
    });

    let emailData = {
      email: user.email,
      userName: user.fullName,
      productName: product.name,
      component: "secondary packaging",
      reason: recordDelay.reason,
      subject: config.get("email.delayTitle"),
    };
    let result = await sendDelayMail(emailData);
    if (result.code) {
      return res
        .status(500)
        .send({ message: "Failure", statusCode: 500, data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE });
    }
  }

  if (recordDelay.packagingType == "formulation") {
    product.productionTime += req.body.days;
    await product.save();
    await Activity.create({
      userId: production.userId,
      productId: production.productId,
      days: req.body.days,
      type: "formulationDelayed",
      newDate: product.insertDate * 1000 + (product.productionTime + parseInt(req.body.days)) * 24 * 60 * 60 * 1000,
    });
    let emailData = {
      email: user.email,
      userName: user.fullName,
      productName: product.name,
      component: "formulation",
      reason: recordDelay.reason,
      subject: config.get("email.delayTitle"),
    };
    let result = await sendDelayMail(emailData);
    if (result.code) {
      return res
        .status(500)
        .send({ message: "Failure", statusCode: 500, data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE });
    }
  }
  if (recordDelay.packagingType == "label") {
    product.productionTime += req.body.days;
    await product.save();
    await Activity.create({
      userId: production.userId,
      productId: production.productId,
      days: req.body.days,
      type: "labelDelayed",
      newDate: product.insertDate * 1000 + (product.productionTime + parseInt(req.body.days)) * 24 * 60 * 60 * 1000,
    });
    let emailData = {
      email: user.email,
      userName: user.fullName,
      productName: product.name,
      component: "label",
      reason: recordDelay.reason,
      subject: config.get("email.delayTitle"),
    };
    let result = await sendDelayMail(emailData);
    if (result.code) {
      return res
        .status(500)
        .send({ message: "Failure", statusCode: 500, data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE });
    }
  }
  return res.send({
    statusCode: 200,
    message: "Success",
    data: { msg: PRODUCTION_CONSTANTS.RECORD_DELAYED },
  });
});

router.put("/", adminAuth, async (req, res) => {
  const { error } = validateRecordPut(req.body);
  if (error) return res.status(400).send({ statusCode: 400, status: "Failure", data: error.details[0].message });

  let recordDelay = await RecordDelay.findById(req.body.recordId);
  if (!recordDelay) {
    return res.status(400).send({ statusCode: 400, status: "Failure", data: PRODUCTION_CONSTANTS.INVALID_RECORD_ID });
  }

  recordDelay.productType = req.body.productType || recordDelay.productType;
  recordDelay.time = req.body.time || recordDelay.time;
  recordDelay.days = req.body.days || recordDelay.days;
  recordDelay.reason = req.body.reason || recordDelay.reason;
  await recordDelay.save();

  await Activity.updateOne(
    { type: recordDelay.productType + "Delayed", productId: recordDelay.productId },
    { $set: { days: recordDelay.days } }
  );

  return res.send({
    statusCode: 200,
    message: "Success",
    data: { msg: PRODUCTION_CONSTANTS.RECORD_UPDATED },
  });
});

router.delete("/:recordId", adminAuth, async (req, res) => {
  let recordDelay = await RecordDelay.findById(req.params.recordId);
  if (!recordDelay) {
    return res.status(400).send({ statusCode: 400, status: "Failure", data: PRODUCTION_CONSTANTS.INVALID_RECORD_ID });
  }
  await RecordDelay.deleteOne({ _id: req.params.recordId });
  await Activity.deleteOne({ type: recordDelay.productType + "Delayed", productId: recordDelay.productId });
  return res.send({
    statusCode: 200,
    message: "Success",
    data: { msg: PRODUCTION_CONSTANTS.RECORD_REMOVED },
  });
});
module.exports = router;
