const { Cart } = require("../models/cart");
const { Activity } = require("../models/activity");
const mongoose = require("mongoose");
const config = require("config");

async function after24Hours() {
  let currentTime = Math.round(new Date() / 1000);
  let ordersIncart = await Cart.find({
    oneTimeTrigger: false,
    status: "pending",
    insertDate: { $lt: currentTime + 86400 },
  });
  for (let index = 0; index < ordersIncart.length; ++index) {
    await Activity.create({
      userId: ordersIncart[index].userId,
      productId: ordersIncart[index].productId,
      type: "24HoursDelay",
    });
    await Cart.updateOne({ _id: ordersIncart[index]._id }, { $set: { oneTimeTrigger: true } });
  }
}
module.exports.after24Hours = after24Hours;
// after24Hours();
