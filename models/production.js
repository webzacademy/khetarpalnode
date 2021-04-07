const Joi = require("joi");
const mongoose = require("mongoose");

const productionSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  cartId: String,
  productStatus: {
    type: String,
    enum: ["onTime", "delayed", "inProduction", "delivered"],
  },
  primary: {
    status: {
      type: String,
      enum: ["submitted", "accepted", "begin", "completed", "qaBegins", "qaCompleted", "shipped", "delivered"],
    },
    shippingUrl: { type: String, default: "" },
    qaImages: Array,
    isOrderPlaced: { type: Boolean, default: true },
    orderPlacedAt: {
      type: Number,
      default: () => {
        return Math.round(new Date() / 1000);
      },
    },
    isAccepted: { type: Boolean, default: true },
    acceptedAt: {
      type: Number,
      default: () => {
        return Math.round(new Date() / 1000);
      },
    },
    isBegin: { type: Boolean, default: false },
    beginAt: Number,
    beginMessage: String,
    isCompleted: { type: Boolean, default: false },
    completedAt: Number,
    completedMessage: String,
    isQualityBegin: { type: Boolean, default: false },
    qualityBeginAt: Number,
    qualityBeginMessage: String,
    isQualityCompleted: { type: Boolean, default: false },
    qualityCompletedAt: Number,
    qualityCompleteMessage: String,
    isShipped: { type: Boolean, default: false },
    shippedAt: Number,
    shippedMessage: String,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Number,
    deliveredMessage: String,
  },
  secondary: {
    status: {
      type: String,
      enum: ["submitted", "accepted", "begin", "completed", "qaBegins", "qaCompleted", "shipped", "delivered"],
    },
    shippingUrl: { type: String, default: "" },
    qaImages: Array,
    isOrderPlaced: { type: Boolean, default: true },
    orderPlacedAt: {
      type: Number,
      default: () => {
        return Math.round(new Date() / 1000);
      },
    },
    isAccepted: { type: Boolean, default: true },
    acceptedAt: {
      type: Number,
      default: () => {
        return Math.round(new Date() / 1000);
      },
    },
    isBegin: { type: Boolean, default: false },
    beginAt: Number,
    beginMessage: String,
    isCompleted: { type: Boolean, default: false },
    completedAt: Number,
    completedMessage: String,
    isQualityBegin: { type: Boolean, default: false },
    qualityBeginAt: Number,
    qualityBeginMessage: String,
    isQualityCompleted: { type: Boolean, default: false },
    qualityCompletedAt: Number,
    qualityCompleteMessage: String,
    isShipped: { type: Boolean, default: false },
    shippedAt: Number,
    shippedMessage: String,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Number,
    deliveredMessage: String,
  },
  formulation: {
    status: {
      type: String,
      enum: ["submitted", "accepted", "begin", "completed", "qaBegins", "qaCompleted", "shipped", "delivered"],
    },
    shippingUrl: { type: String, default: "" },
    qaImages: Array,
    isOrderPlaced: { type: Boolean, default: true },
    orderPlacedAt: {
      type: Number,
      default: () => {
        return Math.round(new Date() / 1000);
      },
    },
    isAccepted: { type: Boolean, default: true },
    acceptedAt: {
      type: Number,
      default: () => {
        return Math.round(new Date() / 1000);
      },
    },
    isBegin: { type: Boolean, default: false },
    beginAt: Number,
    beginMessage: String,
    isCompleted: { type: Boolean, default: false },
    completedAt: Number,
    completedMessage: String,
    isQualityBegin: { type: Boolean, default: false },
    qualityBeginAt: Number,
    qualityBeginMessage: String,
    isQualityCompleted: { type: Boolean, default: false },
    qualityCompletedAt: Number,
    qualityCompleteMessage: String,
    isShipped: { type: Boolean, default: false },
    shippedAt: Number,
    shippedMessage: String,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Number,
    deliveredMessage: String,
  },
  label: {
    status: {
      type: String,
      enum: ["submitted", "accepted", "begin", "completed", "qaBegins", "qaCompleted", "shipped", "delivered"],
    },
    qaImages: Array,
    isOrderPlaced: { type: Boolean, default: true },
    orderPlacedAt: {
      type: Number,
      default: () => {
        return Math.round(new Date() / 1000);
      },
    },
    isAccepted: { type: Boolean, default: true },
    acceptedAt: {
      type: Number,
      default: () => {
        return Math.round(new Date() / 1000);
      },
    },
    isBegin: { type: Boolean, default: false },
    beginAt: Number,
    beginMessage: String,
    isCompleted: { type: Boolean, default: false },
    completedAt: Number,
    completedMessage: String,
    isQualityBegin: { type: Boolean, default: false },
    qualityBeginAt: Number,
    qualityBeginMessage: String,
    isQualityCompleted: { type: Boolean, default: false },
    qualityCompletedAt: Number,
    qualityCompleteMessage: String,
    isShipped: { type: Boolean, default: false },
    shippedAt: Number,
    shippedMessage: String,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Number,
    deliveredMessage: String,
  },
  isDelivered: { type: Boolean, default: false },
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

productionSchema.index({
  userId: 1,
  status: 1,
});

productionSchema.index({
  userId: 1,
  productStatus: 1,
});
const Production = mongoose.model("Production", productionSchema);

function validateProdPut(user) {
  const schema = {
    productionId: Joi.string().min(1).max(200),
    type: Joi.any().valid(["primary", "secondary", "formulation", "label"]),
    isStatus: Joi.boolean(),
    shippingUrl: Joi.string(),
    qaImages: Joi.array(),
    message: Joi.string().allow(""),
    status: Joi.any().valid([
      "submitted",
      "accepted",
      "production",
      "begin",
      "completed",
      "qualityAssurance",
      "qaBegins",
      "qaCompleted",
      "shipped",
      "delivered",
    ]),
    productStatus: Joi.any().valid(["onTime", "delayed", "inProduction", "delivered"]),
  };
  return Joi.validate(user, schema);
}

module.exports.Production = Production;
module.exports.validateProdPut = validateProdPut;
