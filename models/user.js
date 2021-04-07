const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "admin"], default: "user" },
  fullName: { type: String, default: "" },
  mobile: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { mobile: { $type: "string" } },
    },
  },
  email: { type: String, default: "-", required: true, unique: true },
  password: { type: String, default: "" },
  deviceToken: { type: String, default: "" },
  version: { type: String, default: "" },
  facebookId: { type: String, default: "" },
  googleId: { type: String, default: "" },
  accessToken: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive", "blocked", "suspended"] },
  profilePic: { type: String, default: "" },
  address: String,
  addressId: String,
  totalBookings: { type: Number, default: 0 },
  isCompanyAdded: { type: Boolean, default: false },
  isAccountAdded: { type: Boolean, default: false },
  isShippingAdded: { type: Boolean, default: false },
  totalAssignedProducts: { type: Number, default: 0 },
  totalProductsInCart: { type: Number, default: 0 },
  totalProductsInProduction: { type: Number, default: 0 },
  city: String,
  state: String,
  country: String,
  zip: Number,
  mobile: String,
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

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      userId: this._id,
      role: this.role,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

function validateUserPost(user) {
  const schema = {
    name: Joi.string().min(1).max(200).required(),
    password: Joi.string().min(6).max(20).required(),
    email: Joi.string().email().required(),
    version: Joi.string(),
    companyName: Joi.string().required(),
    companyCity: Joi.string(),
    companyState: Joi.string(),
    companyZip: Joi.number().strict(),
    companyCountry: Joi.string(),
    companyAddress: Joi.string(),
    abn: Joi.number().strict(),
    website: Joi.string(),
    profilePic: Joi.string().min(1).max(300).allow(""),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zip: Joi.number().strict(),
    country: Joi.string(),
    mobile: Joi.string(),
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

function validateUserPut(user) {
  const schema = {
    userId: Joi.string(),
    name: Joi.string().min(1).max(200),
    email: Joi.string().email(),
    mobile: Joi.string(),
    address: Joi.string(),
    version: Joi.string(),
    deviceToken: Joi.string().min(1).max(200),
    profilePic: Joi.string().min(1).max(200).allow(""),
    city: Joi.string(),
    state: Joi.string(),
    zip: Joi.number().strict(),
    country: Joi.string(),
    shippingData: Joi.object({
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
    }),
    companyData: Joi.object({
      name: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      zip: Joi.number().strict(),
      website: Joi.string(),
      abn: Joi.number().strict(),
    }),
    status: Joi.string().valid(["active", "inactive", "blocked", "suspended"]),
  };
  return Joi.validate(user, schema);
}

function validateUserListGet(user) {
  const schema = {
    userName: Joi.string().min(1).max(100),
    email: Joi.string().email(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    status: Joi.any().valid(["active", "blocked", "suspended"]),
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUserPost = validateUserPost;
module.exports.validateUserPut = validateUserPut;
module.exports.validateUserListGet = validateUserListGet;
