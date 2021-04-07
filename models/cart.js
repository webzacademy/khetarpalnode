const Joi = require("joi");
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  orderId: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 20,
  },
  productId: String,
  price: { type: Number },
  quantity: { type: Number },
  totalAmount: { type: Number },
  amountLeft: { type: Number },
  amountPaid: { type: Number },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "submitted", "inProgress", "onTime", "delayed", "cancelByUser", "cancelByAdmin", "delivered"],
  },
  primary: {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "submitted", "inProgress", "delivered"],
    },
    isAccepted: { type: Boolean, default: false },
    isSubmitted: { type: Boolean, default: false },
    isProgress: { type: Boolean, default: false },
    isOneTime: { type: Boolean, default: false },
    isDelayed: { type: Boolean, default: false },
  },

  secondary: {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "submitted", "inProgress", "delivered"],
    },
    isAccepted: { type: Boolean, default: false },
    isSubmitted: { type: Boolean, default: false },
    isProgress: { type: Boolean, default: false },
    isOneTime: { type: Boolean, default: false },
    isDelayed: { type: Boolean, default: false },
  },

  formulation: {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "submitted", "inProgress", "delivered"],
    },
    isAccepted: { type: Boolean, default: false },
    isSubmitted: { type: Boolean, default: false },
    isProgress: { type: Boolean, default: false },
    isOneTime: { type: Boolean, default: false },
    isDelayed: { type: Boolean, default: false },
  },
  label: {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "submitted", "inProgress", "delivered"],
    },
    isAccepted: { type: Boolean, default: false },
    isSubmitted: { type: Boolean, default: false },
    isProgress: { type: Boolean, default: false },
    isOneTime: { type: Boolean, default: false },
    isDelayed: { type: Boolean, default: false },
  },
  isDelivered: { type: Boolean, default: false },
  donationAmount: { type: Number },
  donationCard: { type: String, enum: ["plant", "plastic", "housing", ""], default: "" },
  carbonAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  is50Percent: { type: Boolean, default: false },
  is5Percent: { type: Boolean, default: false },
  isPaymentDone: { type: Boolean, default: false },
  deliveryAddress: {
    address: String,
    city: String,
    state: String,
    country: String,
    pinCode: Number,
  },
  oneTimeTrigger: { type: Boolean, default: false },
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

cartSchema.index({
  userId: 1,
  insertDate: 1,
});
const Cart = mongoose.model("Cart", cartSchema);

function validateCartPost(user) {
  const schema = {
    productId: Joi.string().min(1).max(200).required(),
    quantity: Joi.number().strict().required(),
    totalAmount: Joi.number().strict(),
    donationAmount: Joi.number().strict(),
    donationCard: Joi.any().valid(["plant", "plastic", "housing", ""]),
    carbonAmount: Joi.number().strict(),
    discount: Joi.number().strict(),
    amountPaid: Joi.number().strict(),
    amountLeft: Joi.number().strict(),
    is50Percent: Joi.boolean(),
    is5Percent: Joi.boolean(),
    isPaymentDone: Joi.boolean(),
  };
  return Joi.validate(user, schema);
}

function validateCartPut(user) {
  const schema = {
    cartId: Joi.string().min(1).max(200),
    status: Joi.any().valid(["pending", "accepted", "submitted", "inProgress", "cancelByUser", "cancelByAdmin", "deliverd"]),
    type: Joi.any().valid(["primary", "secondary", "formulation"]),
    donationAmount: Joi.number().strict(),
    donationCard: Joi.valid(["plant", "plastic", "housing", ""]),
    carbonAmount: Joi.number().strict(),
    discount: Joi.number().strict(),
    is50Percent: Joi.boolean(),
    is5Percent: Joi.boolean(),
    amountPaid: Joi.number().strict(),
    amountLeft: Joi.number().strict(),
    isPaymentDone: Joi.boolean(),
  };
  return Joi.validate(user, schema);
}

function validateCartAddress(user) {
  const schema = {
    cartId: Joi.string().min(1).max(200).required(),
    deliveryAddress: Joi.object({
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      pinCode: Joi.number().strict(),
    }).required(),
  };
  return Joi.validate(user, schema);
}

module.exports.Cart = Cart;
module.exports.validateCartPost = validateCartPost;
module.exports.validateCartPut = validateCartPut;
module.exports.validateCartAddress = validateCartAddress;
