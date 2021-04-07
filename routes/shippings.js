const { SHIPPING_CONSTANTS } = require("../config/constant.js");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { userAdminAuth, userAuth } = require("../middleware/auth");
const _ = require("lodash");
const { User } = require("../models/user");
const { Shipping, validateShipPost, validateShipPut } = require("../models/shipping");
//--------------------------------------------------------------------------------------------------------
router.post("/", userAuth, async (req, res) => {
  const { error } = validateShipPost(req.body);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });
  let shipping = await Shipping.findOne({ userId: req.jwtData.userId });
  if (!shipping) {
    shipping = new Shipping(_.pick(req.body, ["sampleAddress", "warehouseAddress", "sampleData", "wareHouseData"]));
    shipping.userId = req.jwtData.userId;
    shipping.status = "active";
    try {
      await shipping.save();
    } catch (Ex) {
      if (Ex.code === 11000)
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: SHIPPING_CONSTANTS.DUPLICATE_SHIPPING });
      else
        return res.status(400).send({ statusCode: 400, message: "Failure", data: SHIPPING_CONSTANTS.SYSTEM_FAILURE });
    }
    await User.updateOne({ _id: req.jwtData.userId }, { $set: { isShippingAdded: true } });
  } else {
    shipping.sampleAddress = req.body.sampleAddress || shipping.sampleAddress;
    shipping.warehouseAddress = req.body.warehouseAddress || shipping.warehouseAddress;
    shipping.wareHouseData = req.body.wareHouseData || shipping.wareHouseData;
    shipping.sampleData = req.body.sampleData || shipping.sampleData;
    try {
      await shipping.save();
    } catch (Ex) {
      if (Ex.code === 11000)
        return res
          .status(400)
          .send({ statusCode: 400, message: "Failure", data: SHIPPING_CONSTANTS.DUPLICATE_SHIPPING });
      else
        return res.status(400).send({ statusCode: 400, message: "Failure", data: SHIPPING_CONSTANTS.SYSTEM_FAILURE });
    }
  }
  return res.send({ statusCode: 200, message: "Success", data: { shipping } });
});

router.put("/", userAdminAuth, async (req, res) => {
  const { error } = validateShipPut(req.body);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });

  let shipping = await Shipping.findById(req.body.shippingId);
  if (!shipping) {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: SHIPPING_CONSTANTS.INVALID_ID });
  }

  shipping.sampleAddress = req.body.sampleAddress || shipping.sampleAddress;
  shipping.warehouseAddress = req.body.warehouseAddress || shipping.warehouseAddress;
  await shipping.save();
  return res.send({ statusCode: 200, message: "Success", data: { shipping } });
});

module.exports = router;
