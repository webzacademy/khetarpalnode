const Joi = require("joi");
const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  userId: String,
  nameOnCard: { type: String, minlength: 1, maxlength: 100 },
  cardScheme: { type: String, enum: ["visa", "mastercard", "amex", "discover", "other"] },
  cardType: { type: String, enum: ["credit", "debit"] },
  expiryMonth: Number,
  expiryYear: Number,
  maskedCard: String,
  billingAddress: String,
  city: String,
  state: String,
  country: String,
  zip: Number,
  isDefault: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "blocked", "deleted"],
  },
  insertDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

const Card = mongoose.model("Card", cardSchema);

function validateCardPost(card) {
  const schema = {
    nameOnCard: Joi.string().min(1).max(200),
    maskedCard: Joi.string().min(1).max(200),
    cardScheme: Joi.any().valid(["visa", "mastercard", "amex", "discovery", "other"]),
    cardType: Joi.any().valid(["debit", "credit"]),
    expiryMonth: Joi.number().min(1).max(12),
    expiryYear: Joi.number().min(19).max(2030),
    isDefault: Joi.boolean(),
    billingAddress: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zip: Joi.string(),
    country: Joi.string(),
    status: Joi.any().valid(["active", "blocked", "deleted"]),
  };
  return Joi.validate(card, schema);
}

function validateCardPut(card) {
  const schema = {
    cardId: Joi.string().min(1).max(100).required(),
    nameOnCard: Joi.string().min(1).max(200),
    cardScheme: Joi.any().valid(["visa", "mastercard", "amex", "discovery", "other"]),
    expiryMonth: Joi.number().min(1).max(12),
    expiryYear: Joi.number().min(19).max(2030),
    isDefault: Joi.boolean(),
    status: Joi.any().valid(["active", "blocked", "deleted"]),
  };
  return Joi.validate(card, schema);
}

exports.Card = Card;
exports.validateCardPost = validateCardPost;
exports.validateCardPut = validateCardPut;
