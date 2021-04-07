const Joi = require("joi");
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  userId: String,
  name: { type: String, minlength: 1, maxlength: 100 },
  abn: Number,
  status: { type: String, enum: ["active", "inactive", "suspended", "deleted"] },
  type: { type: String },
  address: String,
  city: String,
  state: String,
  country: String,
  zip: Number,
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

companySchema.index(
  {
    name: 1,
    userId: 1,
  },
  { unique: true }
);
const Company = mongoose.model("Company", companySchema);

function validateCompanyPost(user) {
  const schema = {
    userId: Joi.string().required(),
    name: Joi.string().min(1).max(200).required(),
    abn: Joi.number(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zip: Joi.number(),
    country: Joi.string(),
  };
  return Joi.validate(user, schema);
}

function validateCompanyPut(user) {
  const schema = {
    companyId: Joi.string(),
    name: Joi.string().min(1).max(200),
    abn: Joi.number(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zip: Joi.number(),
    country: Joi.string(),
    status: Joi.string().valid(["active", "inactive", "blocked", "suspended"]),
  };
  return Joi.validate(user, schema);
}

module.exports.Company = Company;
module.exports.validateCompanyPost = validateCompanyPost;
module.exports.validateCompanyPut = validateCompanyPut;
