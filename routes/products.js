const { PRODUCT_CONSTANTS, MANUFACTURER_CONSTANTS, AUTH_CONSTANTS } = require("../config/constant.js");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { userAdminAuth, adminAuth } = require("../middleware/auth");
const { User } = require("../models/user");
const { Cart } = require("../models/cart");
const _ = require("lodash");
const { Production } = require("../models/production");
const { Product, validateProductPost, validateProductPut } = require("../models/product");
const { Manufacturer } = require("../models/manufacturer");
const { sendAllMail, sendProductMail } = require("../services/sendMail");
const formatter = require("../services/commonFunctions");
const { Activity } = require("../models/activity");

//-----------------------------------------------------------------------------------------------------------------
//create product
router.post("/", adminAuth, async (req, res) => {
  const { error } = validateProductPost(req.body);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });
  let user = await User.findOne({ _id: req.body.userId });
  if (!user)
    return res.status(400).send({ statusCode: 400, message: "Failure", data: "UserID does not exit with given id" });
  let product = new Product(
    _.pick(req.body, [
      "userId",
      "name",
      "volume",
      "heroImage",
      "primaryPackaging",
      "secondaryPackaging",
      "formulationPackaging",
      "labelPackaging",
      "carbonOffset",
      "secondaryManufacturerId",
      "formulationManufacturerId",
      "amount",
      "closureDesc",
      "lastProduction",
      "productionTime",
      "pricing",
      "manufacturingPlace",
    ])
  );

  product.nameRegex = req.body.name.toLowerCase();
  product.status = "active";

  if (req.body.primaryManufacturerId) {
    let primaryManufacturerId = req.body.primaryManufacturerId;
    for (let index = 0; index < primaryManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: primaryManufacturerId[index] });
      if (manufacturer) {
        product.primaryManufacturerId.push(manufacturer._id);
      }
    }
  }

  if (req.body.secondaryManufacturerId) {
    let secondaryManufacturerId = req.body.secondaryManufacturerId;
    for (let index = 0; index < secondaryManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: secondaryManufacturerId[index] });
      if (manufacturer) {
        product.secondaryManufacturerId.push(manufacturer._id);
      }
    }
  }

  if (req.body.formulationManufacturerId) {
    let formulationManufacturerId = req.body.formulationManufacturerId;
    for (let index = 0; index < formulationManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: formulationManufacturerId[index] });
      if (manufacturer) {
        product.formulationManufacturerId.push(manufacturer._id);
      }
    }
  }

  if (req.body.labelManufacturerId) {
    let labelManufacturerId = req.body.labelManufacturerId;
    for (let index = 0; index < labelManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: labelManufacturerId[index] });
      if (manufacturer) {
        product.labelManufacturerId.push(manufacturer._id);
      }
    }
  }

  if (req.body.closureManufacturerId) {
    let closureManufacturerId = req.body.closureManufacturerId;
    for (let index = 0; index < closureManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: closureManufacturerId[index] });
      if (manufacturer) {
        product.closureManufacturerId.push(manufacturer._id);
      }
    }
  }
  try {
    await product.save();
    await User.updateOne({ _id: req.body.userId }, { $inc: { totalAssignedProducts: 1 } });
    await Activity.create({
      userId: req.body.userId,
      productId: product._id,
      type: "newProduct",
    });
  } catch (Ex) {
    if (Ex.code === 11000)
      return res.status(400).send({ statusCode: 400, message: "Failure", data: PRODUCT_CONSTANTS.DUPLICATE_PRODUCT });
    else {
      console.log(Ex);
      return res.status(400).send({ statusCode: 400, message: "Failure", data: PRODUCT_CONSTANTS.SYSTEM_FAILURE });
    }
  }
  // console.log(user);
  let data = {
    name: user.fullName || "dummy",
  };
  let emailData = {
    email: user.email,
    name: data.name,
    text: formatter(config.get("email.productAdded"), data),
    subject: config.get("email.productAddedTitle"),
  };
  let result = await sendProductMail(emailData);
  if (result.code) {
    return res
      .status(500)
      .send({ message: "Failure", statusCode: 500, data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE });
  }
  return res.send({ statusCode: 200, message: "Success", data: PRODUCT_CONSTANTS.SUBMIT_SUCCESS });
});

//update product
router.put("/", adminAuth, async (req, res) => {
  const { error } = validateProductPut(req.body);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });

  let product = await Product.findById(req.body.productId);
  if (!product) {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: PRODUCT_CONSTANTS.INVALID_PRODUCT });
  }
  let user = await User.findOne({ _id: product.userId });
  if (req.body.name) {
    product.name = req.body.name || product.name;
    product.nameRegex = req.body.name.toLowerCase();
  }

  product.volume = req.body.volume || product.volume;
  product.heroImage = req.body.heroImage || product.heroImage;
  product.manufacturingPlace = req.body.manufacturingPlace || product.manufacturingPlace;
  product.pricing = req.body.pricing || product.pricing;
  product.productionTime = req.body.productionTime || product.productionTime;

  product.primaryPackaging = req.body.primaryPackaging || product.primaryPackaging;
  product.secondaryPackaging = req.body.secondaryPackaging || product.secondaryPackaging;
  product.formulationPackaging = req.body.formulationPackaging || product.formulationPackaging;
  product.labelPackaging = req.body.labelPackaging || product.labelPackaging;

  product.carbonOffset = req.body.carbonOffset || product.carbonOffset;
  product.compliance = req.body.compliance || product.compliance;
  if (req.body.primaryManufacturerId) {
    let primaryManufacturerId = [];
    for (let index = 0; index < req.body.primaryManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: req.body.primaryManufacturerId[index] });
      primaryManufacturerId.push(manufacturer._id);
    }
    product.primaryManufacturerId = primaryManufacturerId;
  }

  if (req.body.secondaryManufacturerId) {
    let secondaryManufacturerId = [];
    for (let index = 0; index < req.body.secondaryManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: req.body.secondaryManufacturerId[index] });
      if (manufacturer) {
        secondaryManufacturerId.push(manufacturer._id);
      }
    }
    product.secondaryManufacturerId = secondaryManufacturerId;
  }

  if (req.body.formulationManufacturerId) {
    let formulationManufacturerId = [];
    for (let index = 0; index < req.body.formulationManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: req.body.formulationManufacturerId[index] });
      if (manufacturer) {
        formulationManufacturerId.push(manufacturer._id);
      }
    }
    product.formulationManufacturerId = formulationManufacturerId;
  }

  if (req.body.labelManufacturerId) {
    let labelManufacturerId = [];
    for (let index = 0; index < req.body.labelManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: req.body.labelManufacturerId[index] });
      if (manufacturer) {
        labelManufacturerId.push(manufacturer._id);
      }
    }
    product.labelManufacturerId = labelManufacturerId;
  }

  if (req.body.closureManufacturerId) {
    let closureManufacturerId = [];
    for (let index = 0; index < req.body.closureManufacturerId.length; ++index) {
      let manufacturer = await Manufacturer.findOne({ _id: req.body.closureManufacturerId[index] });
      if (manufacturer) {
        closureManufacturerId.push(manufacturer._id);
      }
    }
    product.closureManufacturerId = closureManufacturerId;
  }
  try {
    await product.save();
    if (req.body.type && req.body.type.length > 0) {
      req.body.type.forEach(async (element) => {
        await createActivity(product.userId, product._id, element);
      });
      // await Promise.all(typeUpdated);
    }
  } catch (Ex) {
    if (Ex.code === 11000)
      return res.status(400).send({ statusCode: 400, message: "Failure", data: PRODUCT_CONSTANTS.DUPLICATE_PRODUCT });
    else return res.status(400).send({ statusCode: 400, message: "Failure", data: PRODUCT_CONSTANTS.SYSTEM_FAILURE });
  }
  let data = {
    name: user.fullName,
  };
  let emailData = {
    email: user.email,
    name: data.name,
    text: formatter(config.get("email.productUpdated"), data),
    subject: config.get("email.productUpdatedTitle"),
  };
  let result = await sendAllMail(emailData);
  if (result.code) {
    return res
      .status(500)
      .send({ message: "Failure", statusCode: 500, data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE });
  }
  return res.send({ statusCode: 200, message: "Success", data: { product } });
});

//get product
router.get("/", userAdminAuth, async (req, res) => {
  var skipVal, limitVal;
  if (isNaN(parseInt(req.query.offset))) skipVal = 0;
  else skipVal = parseInt(req.query.offset);

  if (isNaN(parseInt(req.query.limit))) limitVal = 50;
  else limitVal = parseInt(req.query.limit);
  let criteria = {};

  if (req.jwtData.role === "admin") {
    criteria.userId = req.query.userId;
  } else {
    criteria.userId = req.jwtData.userId;
  }

  if (req.query.name) {
    var regexName = new RegExp("^" + req.query.name + ".*", "i");
    criteria.nameRegex = { $regex: regexName };
  }
  criteria.status = "active";
  let productsList = await Product.aggregate([
    { $match: criteria },
    { $sort: { insertDate: -1 } },
    { $skip: skipVal },
    { $limit: limitVal },

    {
      $lookup: {
        from: "manufacturers",
        let: {
          manufacturerId: "$primaryManufacturerId",
          type: "$type",
        },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$manufacturerId"] },
            },
          },
          {
            $project: {
              _id: 0,
              manufacturerId: "$_id",
              name: 1,
              address: 1,
              contactName: 1,
              contactEmail: 1,
              phone: 1,
              weChatId: 1,
              country: 1,
              finalVersion: 1,
              website: 1,
              city: 1,
              zipCode: 1,
              country: 1,
              state: 1,
            },
          },
        ],
        as: "primaryManufacturerData",
      },
    },
    {
      $lookup: {
        from: "manufacturers",
        let: {
          manufacturerId: "$secondaryManufacturerId",
        },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$manufacturerId"] },
            },
          },
          {
            $project: {
              _id: 0,
              manufacturerId: "$_id",
              name: 1,
              address: 1,
              contactName: 1,
              contactEmail: 1,
              phone: 1,
              weChatId: 1,
              country: 1,
              finalVersion: 1,
              website: 1,
              city: 1,
              zipCode: 1,
              country: 1,
              state: 1,
            },
          },
        ],
        as: "secondaryManufacturerData",
      },
    },
    {
      $lookup: {
        from: "manufacturers",
        let: {
          manufacturerId: "$formulationManufacturerId",
        },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$manufacturerId"] },
            },
          },
          {
            $project: {
              _id: 0,
              manufacturerId: "$_id",
              name: 1,
              address: 1,
              contactName: 1,
              contactEmail: 1,
              phone: 1,
              weChatId: 1,
              country: 1,
              finalVersion: 1,
              website: 1,
              city: 1,
              zipCode: 1,
              country: 1,
              state: 1,
            },
          },
        ],
        as: "formulationManufacturerData",
      },
    },
    {
      $lookup: {
        from: "manufacturers",
        let: {
          manufacturerId: "$labelManufacturerId",
        },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$manufacturerId"] },
            },
          },
          {
            $project: {
              _id: 0,
              manufacturerId: "$_id",
              name: 1,
              address: 1,
              contactName: 1,
              contactEmail: 1,
              phone: 1,
              weChatId: 1,
              country: 1,
              finalVersion: 1,
              website: 1,
              city: 1,
              zipCode: 1,
              country: 1,
              state: 1,
            },
          },
        ],
        as: "labelManufacturerData",
      },
    },

    {
      $lookup: {
        from: "manufacturers",
        let: {
          manufacturerId: "$closureManufacturerId",
        },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$manufacturerId"] },
            },
          },
          {
            $project: {
              _id: 0,
              manufacturerId: "$_id",
              name: 1,
              address: 1,
              contactName: 1,
              contactEmail: 1,
              phone: 1,
              weChatId: 1,
              country: 1,
              finalVersion: 1,
              website: 1,
              city: 1,
              zipCode: 1,
              country: 1,
              state: 1,
            },
          },
        ],
        as: "closureManufacturerData",
      },
    },
    {
      $lookup: {
        from: "productions",
        let: {
          productId: { $toString: "$_id" },
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$productId", "$$productId"] }, { $eq: ["$productStatus", "delivered"] }],
              },
            },
          },
          { $sort: { insertDate: -1 } },
          { $limit: 1 },
          {
            $addFields: {
              productId: { $toObjectId: "$productId" },
              cartId: { $toObjectId: "$cartId" },
            },
          },
          { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "productData" } },
          { $lookup: { from: "carts", localField: "cartId", foreignField: "_id", as: "cartData" } },
          {
            $project: {
              _id: 0,
              productionId: "$_id",
              productionTime: 1,
              quantity: 1,
              totalAmount: 1,
              status: 1,
              insertDate: 1,
              creationDate: 1,
              userData: 1,
              primary: 1,
              secondary: 1,
              formulation: 1,
              isDelivered: 1,
              productStatus: 1,
              pricing: 1,
              manufacturingPlace: 1,
              orderId: { $arrayElemAt: ["$cartData.orderId", 0] },
              quantity: { $arrayElemAt: ["$cartData.quantity", 0] },
              totalAmount: { $arrayElemAt: ["$cartData.totalAmount", 0] },
              productId: { $arrayElemAt: ["$productData._id", 0] },
              name: { $arrayElemAt: ["$productData.name", 0] },
              volume: { $arrayElemAt: ["$productData.volume", 0] },
              heroImage: { $arrayElemAt: ["$productData.heroImage", 0] },
              primaryPackaging: { $arrayElemAt: ["$productData.primaryPackaging", 0] },
              secondaryPackaging: { $arrayElemAt: ["$productData.secondaryPackaging", 0] },
              formulationPackaging: { $arrayElemAt: ["$productData.formulationPackaging", 0] },
              carbonOffset: { $arrayElemAt: ["$productData.carbonOffset", 0] },
              productstatus: { $arrayElemAt: ["$productData.status", 0] },
              compliance: { $arrayElemAt: ["$productData.compliance", 0] },
            },
          },
        ],
        as: "latestInProduction",
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: 1,
        volume: 1,
        heroImage: 1,
        primaryPackaging: 1,
        secondaryPackaging: 1,
        formulationPackaging: 1,
        labelPackaging: 1,
        carbonOffset: 1,
        status: 1,
        compliance: 1,
        pricing: 1,
        primaryManufacturerData: 1,
        secondaryManufacturerData: 1,
        formulationManufacturerData: 1,
        labelManufacturerData: 1,
        closureManufacturerData: 1,
        manufacturingPlace: 1,
        latestInProduction: { $arrayElemAt: ["$latestInProduction", 0] },
      },
    },
  ]);
  return res.send({ statusCode: 200, message: "Success", data: { productsList } });
});

//delete product
router.delete("/:id", adminAuth, async (req, res) => {
  let product = await Product.findOne({ _id: req.params.id, status: "active" });
  if (!product) {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: PRODUCT_CONSTANTS.INVALID_PRODUCT });
  }
  let inProduction = await Production.find({ productId: req.params.id, productStatus: { $ne: "delivered" } });
  if (inProduction.length > 0) {
    return res.status(400).send({
      statusCode: 400,
      message: "Failure",
      data: "There is one or more products of this user in production right now.You can't delete the product right now",
    });
  }
  let result = await Product.updateOne({ _id: req.params.id }, { $set: { status: "deleted" } });

  if (result.n) {
    await Cart.deleteOne({ productId: req.params.id });
    await Production.deleteOne({ productId: req.params.id });
    let user = await User.findOne({ _id: product.userId });
    await User.updateOne({ _id: user._id }, { $inc: { totalAssignedProducts: -1 } });
    await Activity.create({
      userId: req.body.userId,
      productId: product._id,
      type: "deletedProduct",
    });
    let data = {
      name: user.fullName,
    };
    let emailData = {
      email: user.email,
      name: data.name,
      text: formatter(config.get("email.productRemoved"), data),
      subject: config.get("email.productRemovedTitle"),
    };
    result = await sendAllMail(emailData);
    if (result.code) {
      return res
        .status(500)
        .send({ message: "Failure", statusCode: 500, data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE });
    }
    return res.send({ statusCode: 200, message: "Success", data: "Product Deleted Successfully" });
  } else {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: "Product Id not found" });
  }
});

async function createActivity(userId, productId, type) {
  await Activity.create({
    userId: userId,
    productId: productId,
    type: type,
    productType: "updated",
  });
}
module.exports = router;
