const Joi = require("joi");
const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema({
  name: String,
  address: String,
  contactName: String,
  contactEmail: String,
  phone: String,
  weChatId: String,
  country: String,
  finalVersion: String,
  totalSold: Number,
  totalRating: Number,
  avgRating: Number,
  totalProductsAlloted: Number,
  nameRegex: String,
  status: { type: String, enum: ["active", "inactive", "deleted"] },
  type: { type: String, enum: ["primary", "secondary", "formulation", "label", "closure"] },
  city: String,
  zipCode: Number,
  state: String,
  website: String,
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

manufacturerSchema.index({
  insertDate: -1,
});

manufacturerSchema.index(
  {
    type: 1,
    name: 1,
  },
  { unique: true }
);
const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);

function validateManufacturerPost(manufacturer) {
  const schema = {
    name: Joi.string().required(),
    type: Joi.string().valid(["primary", "secondary", "formulation", "label", "closure"]).required(),
    address: Joi.string(),
    contactName: Joi.string(),
    contactEmail: Joi.string(),
    phone: Joi.string(),
    weChatId: Joi.string(),
    country: Joi.string(),
    finalVersion: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    website: Joi.string(),
    zipCode: Joi.number().strict(),
  };
  return Joi.validate(manufacturer, schema);
}
function validateManufacturerGet(manufacturer) {
  const schema = {
    name: Joi.string(),
    type: Joi.string().valid(["primary", "secondary", "formulation", "label", "closure"]),
  };
  return Joi.validate(manufacturer, schema);
}

module.exports.Manufacturer = Manufacturer;
module.exports.validateManufacturerPost = validateManufacturerPost;
module.exports.validateManufacturerGet = validateManufacturerGet;
