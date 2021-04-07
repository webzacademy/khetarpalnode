const Joi = require("joi");
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: String,
  isRead: { type: Boolean, default: false },
  productId: String,
  productType: String,
  percentage: Number,
  days: Number,
  productionId: String,
  type: {
    type: String,
    enum: [
      "primary",
      "secondary",
      "formulation",
      "label",
      "newProduct",
      "deletedProduct",
      "submitOrder",
      "orderNotPlaced",
      "editProduct",
      "primaryAccepted",
      "secondaryAccepted",
      "labelAccepted",
      "formulationAccepted",
      "primaryCompleted",
      "secondaryCompleted",
      "labelCompleted",
      "formulationCompleted",
      "allAccepted",
      "primaryDelayed",
      "secondaryDelayed",
      "labelDelayed",
      "formulationDelayed",
      "24HoursDelay",
    ],
  },
  newDate: { type: Date },
  insertDate: {
    type: Number,
    default: () => {
      return Math.round(new Date() / 1000);
    },
  },
});

const Activity = mongoose.model("Activity", activitySchema);

exports.Activity = Activity;
