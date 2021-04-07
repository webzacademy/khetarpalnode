const { CART_CONSTANTS } = require("../config/constant.js");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { userAdminAuth, adminAuth } = require("../middleware/auth");
const _ = require("lodash");
const { User } = require("../models/user");
const { Product } = require("../models/product");
const { Cart, validateCartPost, validateCartPut, validateCartAddress } = require("../models/cart");
const { Production } = require("../models/production");
const { Shipping } = require("../models/shipping");
const { Activity } = require("../models/activity");
const { orderPlacedMail, orderSubmittedMail } = require("../services/sendMail");
//------------------------------------------------------------------------
router.post("/", userAuth, async (req, res) => {
  const { error } = validateCartPost(req.body);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });

  let product = await Product.findById(req.body.productId);
  let user = await User.findOne({ _id: product.userId });
  if (!product) {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: CART_CONSTANTS.INVALID_ID });
  }

  let cart = new Cart(
    _.pick(req.body, [
      "productId",
      "quantity",
      "totalAmount",
      "donationAmount",
      "donationCard",
      "carbonAmount",
      "amountLeft",
      "amountPaid",
      "is5Percent",
      "is50Percent",
      "isPaymentDone",
    ])
  );
  cart.userId = req.jwtData.userId;
  cart.price = product.pricing[0].pricePerUnit;
  cart.orderId = "OR" + Math.floor(1000 + Math.random() * 9000);

  await cart.save();
  await Activity.create({
    userId: req.jwtData.userId,
    productId: cart.productId,
    type: "orderNotPlaced",
  });

  await User.updateOne({ _id: req.jwtData.userId }, { $inc: { totalProductsInCart: 1 } });
  let Odata = {
    email: user.email,
    userName: user.fullName,
    orderId: cart.orderId,
    cost: product.pricing[0].pricePerUnit,
    units: product.pricing[0].units,
    RRP: product.pricing[0].rrp,
    heroImage: product.heroImage,
    productName: product.name,
    margin: product.pricing[0].margin,
    subject: config.get("email.orderPlaced"),
  };

  const result = await orderPlacedMail(Odata);
  if (result.code) {
    return res.status(500).send({ statusCode: 400, message: "Failure", data: OTP_CONSTANTS.EMAIL_SENDING_FAILED });
  }
  return res.send({
    statusCode: 200,
    message: "Success",
    data: {
      msg: CART_CONSTANTS.SUBMIT_SUCCESS,
      totalProductsInCart: req.userData.totalProductsInCart + 1,
      orderId: cart.orderId,
    },
  });
});

//delete cart
router.delete("/:id", userAdminAuth, async (req, res) => {
  let cart = await Cart.findOne({ _id: req.params.id });
  if (!cart) {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: CART_CONSTANTS.INVALID_ID });
  }
  let result = await Cart.deleteOne({ _id: req.params.id });
  if (result.deletedCount) {
    await User.updateOne({ _id: cart.userId }, { $inc: { totalProductsInCart: -1 } });
    return res.send({ statusCode: 200, message: "Success", data: CART_CONSTANTS.DELETE_SUCCESS });
  } else {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: CART_CONSTANTS.INVALID_ID });
  }
});

// Update existing cart
router.put("/", userAuth, async (req, res) => {
  const { error } = validateCartPut(req.body);
  if (error) return res.status(400).send({ statusCode: 400, status: "Failure", data: error.details[0].message });

  let cart = await Cart.findById({ _id: req.body.cartId });
  if (!cart) {
    return res.status(400).send({ statusCode: 400, status: "Failure", data: CART_CONSTANTS.INVALID_ID });
  }
  let product = await Product.findById(cart.productId);
  let user = await User.findOne({ _id: product.userId });
  let shippingData = await Shipping.findOne({ userId: product.userId });

  if (cart.isPaymentDone == false && cart.amountLeft > 0) {
    await Cart.updateOne({ _id: req.body.cartId }, { $set: { amountLeft: 0, isPaymentDone: true } });
    await Cart.updateOne({ _id: req.body.cartId }, { $inc: { amountPaid: req.body.amountPaid } });
    user = await User.findById(req.jwtData.userId);
    let response = {
      totalProductsInCart: user.totalProductsInCart,
      totalProductsInProduction: user.totalProductsInProduction,
      orderId: cart.orderId,
    };
    return res.send({ statusCode: 200, status: "Success", data: response });
  }
  if (cart.status != "pending") {
    return res.status(400).send({ statusCode: 400, status: "Failure", data: CART_CONSTANTS.ALREADY_SUBMITTED });
  }
  //payment pending
  if (req.jwtData.role === "user") {
    cart.status = "submitted";

    cart.donationAmount = req.body.donationAmount;
    cart.donationCard = req.body.donationCard;
    cart.carbonAmount = req.body.carbonAmount;
    cart.discount = req.body.discount;
    if (req.body.amountLeft == 0) {
      cart.amountLeft = 0;
    } else {
      cart.amountLeft = req.body.amountLeft;
    }
    cart.amountPaid = req.body.amountPaid || cart.amountPaid;
    cart.is50Percent = req.body.is50Percent || cart.is50Percent;
    cart.is5Percent = req.body.is5Percent || cart.is5Percent;
    if (req.body.isPaymentDone == true || req.body.isPaymentDone == false) cart.isPaymentDone = req.body.isPaymentDone;
    cart.primary.status = "submitted";
    cart.secondary.status = "submitted";
    cart.formulation.status = "submitted";

    await cart.save();
    let production = new Production({
      productId: cart.productId,
      cartId: cart._id,
      userId: cart.userId,
      "primary.status": "accepted",
      "secondary.status": "accepted",
      "formulation.status": "accepted",
      "label.status": "accepted",
      productStatus: "inProduction",
    });
    await production.save();

    await Activity.create({
      userId: req.jwtData.userId,
      productId: cart.productId,
      type: "submitOrder",
    });

    if (req.userData.totalProductsInCart > 0) await User.updateOne({ _id: cart.userId }, { $inc: { totalProductsInCart: -1, totalProductsInProduction: 1 } });

    let deliverDate = new Date(product.insertDate * 1000 + product.productionTime * 24 * 60 * 60 * 1000);
    let tempDate = deliverDate.toISOString();
    let newDate = tempDate.substring(0, tempDate.indexOf("T"));
    let Odata = {
      email: user.email,
      userName: user.fullName,
      orderId: cart.orderId,
      cost: product.pricing[0].pricePerUnit,
      units: product.pricing[0].units,
      RRP: product.pricing[0].rrp,
      heroImage: product.heroImage,
      productName: product.name,
      margin: product.pricing[0].margin,
      primaryProductionTime: product.primaryPackaging[0].productionTime,
      secondaryProductionTime: product.secondaryPackaging[0].productionTime,
      formulationProductionTime: product.formulationPackaging[0].productionTime,
      labelProductionTime: product.labelPackaging[0].productionTime,
      productionTime: product.productionTime,
      subject: config.get("email.orderConfirmed"),
      quantity: cart.quantity,
      amount: cart.price,
      deliveredDate: newDate,
      totalAmount: cart.totalAmount,
      donationAmount: cart.donationAmount,
      shippingAddress: shippingData.warehouseAddress,
    };

    const result = await orderSubmittedMail(Odata);
    if (result.code) {
      return res.status(500).send({ statusCode: 400, message: "Failure", data: OTP_CONSTANTS.EMAIL_SENDING_FAILED });
    }
  }

  user = await User.findById(req.jwtData.userId);
  let response = {
    totalProductsInCart: user.totalProductsInCart,
    totalProductsInProduction: user.totalProductsInProduction,
    orderId: cart.orderId,
  };
  res.send({ statusCode: 200, status: "Success", data: response });
});

router.get("/admin/:productId", adminAuth, async (req, res) => {
  var skipVal, limitVal;
  if (isNaN(parseInt(req.query.offset))) skipVal = 0;
  else skipVal = parseInt(req.query.offset);

  if (isNaN(parseInt(req.query.limit))) limitVal = 10;
  else limitVal = parseInt(req.query.limit);

  let cartList = await Cart.aggregate([
    {
      $match: { productId: req.params.productId },
    },
    { $sort: { insertDate: -1 } },
    { $skip: skipVal },
    { $limit: limitVal },
    {
      $addFields: {
        productId: { $toObjectId: "$productId" },
        userId: { $toString: "$userId" },
      },
    },
    { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "productData" } },
    {
      $project: {
        _id: 0,
        cartId: "$_id",
        quantity: 1,
        totalAmount: 1,
        status: 1,
        orderId: 1,
        insertDate: { $dateToString: { format: "%d-%m-%Y", date: "$creationDate" } },
        creationDate: 1,
        donationCard: 1,
        donationAmount: 1,
        carbonAmount: 1,
        discount: 1,
        deliveryAddress: 1,
        isPaymentDone: 1,
        productId: { $arrayElemAt: ["$productData._id", 0] },
        name: { $arrayElemAt: ["$productData.name", 0] },
        volume: { $arrayElemAt: ["$productData.volume", 0] },
        heroImage: { $arrayElemAt: ["$productData.heroImage", 0] },
        primaryPackaging: { $arrayElemAt: ["$productData.primaryPackaging", 0] },
        secondaryPackaging: { $arrayElemAt: ["$productData.secondaryPackaging", 0] },
        formulationPackaging: { $arrayElemAt: ["$productData.formulationPackaging", 0] },
        labelPackaging: { $arrayElemAt: ["$productData.labelPackaging", 0] },
        carbonOffset: { $arrayElemAt: ["$productData.carbonOffset", 0] },
        productStatus: { $arrayElemAt: ["$productData.status", 0] },
        pricing: { $arrayElemAt: ["$productData.pricing", 0] },
        manufacturingPlace: { $arrayElemAt: ["$productData.manufacturingPlace", 0] },
      },
    },
  ]);
  return res.send({ statusCode: 200, message: "Success", data: { cartList } });
});

router.get("/", userAdminAuth, async (req, res) => {
  var skipVal, limitVal;
  if (isNaN(parseInt(req.query.offset))) skipVal = 0;
  else skipVal = parseInt(req.query.offset);

  if (isNaN(parseInt(req.query.limit))) limitVal = 10;
  else limitVal = parseInt(req.query.limit);
  let criteria = {};
  if (req.jwtData.role == "admin") {
    if (req.query.userId) {
      criteria.userId = req.query.userId;
      var shippingData = await Shipping.findOne({ userId: req.query.userId, status: "active" }, { _id: 0, sampleAddress: 1, warehouseAddress: 1 });
    }
  } else if (req.jwtData.role == "user") {
    criteria.userId = req.jwtData.userId;
  }

  let cartList = await Cart.aggregate([
    {
      $match: criteria,
    },
    { $sort: { insertDate: -1 } },
    { $skip: skipVal },
    { $limit: limitVal },
    {
      $addFields: {
        productId: { $toObjectId: "$productId" },
        userId: { $toString: "$userId" },
      },
    },
    { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "productData" } },
    {
      $project: {
        _id: 0,
        cartId: "$_id",
        quantity: 1,
        totalAmount: 1,
        status: 1,
        orderId: 1,
        insertDate: { $dateToString: { format: "%d-%m-%Y", date: "$creationDate" } },
        creationDate: 1,
        donationCard: 1,
        donationAmount: 1,
        carbonAmount: 1,
        discount: 1,
        primary: 1,
        secondary: 1,
        formulation: 1,
        isDelivered: 1,
        deliveryAddress: 1,
        amountLeft: 1,
        amountPaid: 1,
        is50Percent: 1,
        is5Percent: 1,
        isPaymentDone: 1,
        productId: { $arrayElemAt: ["$productData._id", 0] },
        name: { $arrayElemAt: ["$productData.name", 0] },
        volume: { $arrayElemAt: ["$productData.volume", 0] },
        heroImage: { $arrayElemAt: ["$productData.heroImage", 0] },
        primaryPackaging: { $arrayElemAt: ["$productData.primaryPackaging", 0] },
        secondaryPackaging: { $arrayElemAt: ["$productData.secondaryPackaging", 0] },
        formulationPackaging: { $arrayElemAt: ["$productData.formulationPackaging", 0] },
        labelPackaging: { $arrayElemAt: ["$productData.labelPackaging", 0] },
        carbonOffset: { $arrayElemAt: ["$productData.carbonOffset", 0] },
        productStatus: { $arrayElemAt: ["$productData.status", 0] },
        pricing: { $arrayElemAt: ["$productData.pricing", 0] },
        manufacturingPlace: { $arrayElemAt: ["$productData.manufacturingPlace", 0] },
      },
    },
  ]);
  return res.send({ statusCode: 200, message: "Success", data: { cartList, shippingData } });
});

router.get("/history/:productId", async (req, res) => {
  var skipVal, limitVal;
  if (isNaN(parseInt(req.query.offset))) skipVal = 0;
  else skipVal = parseInt(req.query.offset);

  if (isNaN(parseInt(req.query.limit))) limitVal = 10;
  else limitVal = parseInt(req.query.limit);

  let cartList = await Cart.aggregate([
    {
      $match: { productId: req.params.productId },
    },
    { $sort: { insertDate: -1 } },
    { $skip: skipVal },
    { $limit: limitVal },
    {
      $addFields: {
        productId: { $toObjectId: "$productId" },
      },
    },
    { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "productData" } },
    {
      $project: {
        _id: 0,
        cartId: "$_id",
        quantity: 1,
        totalAmount: 1,
        status: 1,
        orderId: 1,
        insertDate: { $dateToString: { format: "%d-%m-%Y", date: "$creationDate" } },
        creationDate: 1,
        donationCard: 1,
        donationAmount: 1,
        carbonAmount: 1,
        discount: 1,
        deliveryAddress: 1,
        amountLeft: 1,
        amountPaid: 1,
        is50Percent: 1,
        is5Percent: 1,
        isPaymentDone: 1,
        productId: { $arrayElemAt: ["$productData._id", 0] },
        name: { $arrayElemAt: ["$productData.name", 0] },
      },
    },
  ]);
  return res.send({ statusCode: 200, message: "Success", data: { cartList } });
});

// save delivery address
router.post("/address", userAuth, async (req, res) => {
  const { error } = validateCartAddress(req.body);
  if (error) return res.status(400).send({ statusCode: 400, status: "Failure", data: error.details[0].message });

  let cart = await Cart.findById({ _id: req.body.cartId });
  if (!cart) {
    return res.status(400).send({ statusCode: 400, status: "Failure", data: CART_CONSTANTS.INVALID_ID });
  }

  cart.deliveryAddress = req.body.deliveryAddress;
  await cart.save();
  res.send({ statusCode: 200, status: "Success", data: "Delivery address saved successfully" });
});

module.exports = router;
