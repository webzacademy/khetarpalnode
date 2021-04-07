const Joi = require("joi");
const mongoose = require("mongoose");

const RecordDelaySchema = new mongoose.Schema({
  productionId: String,
  productType: {
    type: String,
    enum: [
      "accepted",
      "submitted",
      "begin",
      "completed",
      "qualityAssurance",
      "qaBegins",
      "qaCompleted",
      "shipped",
      "delivered",
    ],
  },
  packagingType: {
    type: String,
    enum: ["primary", "secondary", "formulation", "label"],
  },
  days: Number,
  reason: String,
  creationDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  insertDate: {
    type: Number,
    default: () => {
      return Math.round(new Date() / 1000);
    },
  },
});

RecordDelaySchema.index({
  productionId: 1,
  packagingType: 1,
});
const RecordDelay = mongoose.model("RecordDelay", RecordDelaySchema);

function validateRecordPost(record) {
  const schema = {
    productionId: Joi.string().min(1).max(200).required(),
    productType: Joi.any()
      .valid([
        "accepted",
        "submitted",
        "begin",
        "completed",
        "qualityAssurance",
        "qaBegins",
        "qaCompleted",
        "shipped",
        "delivered",
      ])
      .required(),
    packagingType: Joi.any().valid(["primary", "secondary", "formulation", "label"]).required(),
    days: Joi.number().strict().required(),
    reason: Joi.string().max(1000).allow(""),
  };
  return Joi.validate(record, schema);
}

function validateRecordPut(record) {
  const schema = {
    recordId: Joi.string().min(24).required(),
    productType: Joi.any().valid([
      "accepted",
      "submitted",
      "begin",
      "completed",
      "qualityAssurance",
      "qaBegins",
      "qaCompleted",
      "shipped",
      "delivered",
    ]),
    packagingType: Joi.any().valid(["primary", "secondary", "formulation", "label"]),
    days: Joi.number().strict(),
    reason: Joi.string().max(1000),
  };
  return Joi.validate(record, schema);
}

module.exports.RecordDelay = RecordDelay;
module.exports.validateRecordPost = validateRecordPost;
module.exports.validateRecordPut = validateRecordPut;
