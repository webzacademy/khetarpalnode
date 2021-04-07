const Joi = require("joi");
const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  userId: String,
  sampleAddress: { type: String },
  warehouseAddress: { type: String },
  sampleData: {
    city: String,
    state: String,
    country: String,
    zip: Number,
  },
  wareHouseData: {
    city: String,
    state: String,
    country: String,
    zip: Number,
  },
  status: { type: String, enum: ["active", "inactive", "suspended", "deleted"] },
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

shippingSchema.index({
  userId: 1,
  status: 1,
});
const Shipping = mongoose.model("Shipping", shippingSchema);

function validateShipPost(user) {
  const schema = {
    sampleAddress: Joi.string(),
    warehouseAddress: Joi.string(),
    sampleData: Joi.object({
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      zip: Joi.number().strict(),
    }),
    wareHouseData: Joi.object({
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      zip: Joi.number().strict(),
    }),
  };
  return Joi.validate(user, schema);
}

function validateShipPut(user) {
  const schema = {
    shippingId: Joi.string(),
    sampleAddress: Joi.string().min(1).max(200),
    warehouseAddress: Joi.string(),
    sampleData: Joi.object({
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      zip: Joi.number().strict(),
    }),
    wareHouseData: Joi.object({
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      zip: Joi.number().strict(),
    }),
    status: Joi.string().valid(["active", "inactive", "blocked", "suspended"]),
  };
  return Joi.validate(user, schema);
}

module.exports.Shipping = Shipping;
module.exports.validateShipPost = validateShipPost;
module.exports.validateShipPut = validateShipPut;
