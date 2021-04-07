const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { userAuth, userRestaurantAuth } = require("../middleware/auth");
const _ = require("lodash");
const { Card, validateCardPost, validateCardPut } = require("../models/card");
const { User } = require("../models/user");

router.get("/", userAuth, async (req, res) => {
  var cardList = await Card.aggregate([
    { $match: { user_id: req.jwtData.user_id, status: "active" } },
    { $addFields: { cardId: "$_id" } },
    {
      $project: {
        _id: 0,
        cardId: 1,
        nameOnCard: 1,
        cardScheme: 1,
        cardType: 1,
        expiryMonth: 1,
        expiryYear: 1,
        maskedCard: 1,
        isDefault: 1,
        city: 1,
        state: 1,
        zip: 1,
        country: 1,
        billingAddress: 1,
      },
    },
    { $sort: { insertDate: -1 } },
  ]);
  return res.send({ statusCode: 200, status: "Success", data: { cardList } });
});

router.post("/", userAuth, async (req, res) => {
  const { error } = validateCardPost(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let user = await User.findOne({ _id: req.jwtData.userId });
  if (!user) return res.status(400).send({ msg: "No user registered with given Id" });

  let card = new Card(
    _.pick(req.body, [
      "nameOnCard",
      "cardScheme",
      "cardType",
      "expiryMonth",
      "expiryYear",
      "maskedCard",
      "isDefault",
      "city",
      "state",
      "zip",
      "country",
      "billingAddress",
    ])
  );

  if (card.isDefault) {
    await Card.updateMany({ user_id: req.jwtData.user_id }, { $set: { isDefault: false } });
  }

  card.status = "active";

  await card.save();
  card.cardId = card._id;
  let response = _.pick(card, [
    "cardId",
    "user_id",
    "nameOnCard",
    "cardScheme",
    "cardType",
    "expiryMonth",
    "expiryYear",
    "maskedCard",
    "isDefault",
    "city",
    "state",
    "zip",
    "country",
    "billingAddress",
  ]);

  res.send({ statusCode: 200, status: "Success", data: response });
});

module.exports = router;
