const express = require("express");
const router = express.Router();
const Payments = require("../models/payments");
const { userAuth } = require("../middleware/auth");
const BrainTreeGateway = require("../services/braintreeService");
const responseHanlder = require("../services/responseHandler");

const generateToken = async (req, res, next) => {
  try {
    const response = await BrainTreeGateway.clientToken.generate({});
    responseHanlder.success(res, { payment_token: response.clientToken }, 200);
  } catch (e) {
    next(e);
  }
};

const payment_checkout = async (req, res, next) => {
  try {
    const {
      payment_amount,
      payment_method,
      user_device_details,
      user_id,
      product_id,
    } = req.body;
    const response = await BrainTreeGateway.transaction.sale({
      amount: payment_amount,
      paymentMethodNonce: payment_method,
      deviceData: user_device_details,
      options: {
        submitForSettlement: true,
      },
    });
    console.log(response, "responseee");
    if (response.success) {
      const params = {
        user_id: req.jwtData.userId,
        product_id,
        payment_method,
        user_device_details,
        payment_amount,
        transctions: response.transaction,
      };
      console.log(params, "paramsss");
      const Payment = await new Payments(params).save();
      console.log(Payment);
      responseHanlder.success(res, "Payment SuccessFully done.", 200);
    } else {
      responseHanlder.failure(res, response.message, 400);
    }
  } catch (e) {
    next(e);
  }
};

router.get("/braintree_token", generateToken);
router.post("/checkout", userAuth, payment_checkout);

module.exports = router;
