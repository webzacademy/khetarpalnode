const { PRODUCTION_CONSTANTS } = require("../config/constant.js");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { userAdminAuth, adminAuth } = require("../middleware/auth");
const _ = require("lodash");
const { User } = require("../models/user");
const { Cart } = require("../models/cart");
const { Product } = require("../models/product");
const { Production, validateProdPut } = require("../models/production");
const { Activity } = require("../models/activity");
const { Shipping } = require("../models/shipping");
const { sendAcceptedMail, trackingMail, sendProductShippedMail } = require("../services/sendMail");
const formatter = require("../services/commonFunctions");
//-----------------------------------------------------------------------------------------------------
router.delete("/:id", userAuth, async (req, res) => {
  let cart = await Cart.deleteOne({ _id: req.params.id });
  if (cart.deletedCount) {
    await User.updateOne({ _id: req.jwtData.userId }, { $inc: { totalProductsInCart: -1 } });
    return res.send({
      statusCode: 200,
      message: "Success",
      data: CART_CONSTANTS.DELETE_SUCCESS,
    });
  } else {
    return res.status(400).send({
      statusCode: 400,
      message: "Failure",
      data: CART_CONSTANTS.INVALID_ID,
    });
  }
});

// Update existing production
router.put("/", adminAuth, async (req, res) => {
  const { error } = validateProdPut(req.body);
  if (error)
    return res.status(400).send({
      statusCode: 400,
      status: "Failure",
      data: error.details[0].message,
    });

  let production = await Production.findById(req.body.productionId);
  if (!production) {
    return res.status(400).send({
      statusCode: 400,
      status: "Failure",
      data: PRODUCTION_CONSTANTS.INVALID_ID,
    });
  }

  let cart = await Cart.findOne({ _id: production.cartId });
  console.log(req.body.isStatus, "istatussss");
  //PRIMARY
  if (req.body.type == "primary") {
    if (req.body.shippingUrl) {
      await Production.updateOne({ _id: req.body.productionId }, { $set: { "primary.shippingUrl": req.body.shippingUrl } });
    } else {
      //code begin for  begin to accepted and vice-versa
      if (req.body.status === "begin" && req.body.isStatus == true) {
        if (production.primary.status != "accepted") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to accept the order",
          });
        }
        await Cart.updateOne(
          { _id: production.cartId, status: "submitted" },
          {
            $set: {
              "primary.status": "inProgress",
              "primary.isProgress": req.body.isStatus,
            },
          }
        );
        await Production.updateOne(
          { _id: req.body.productionId, "primary.status": "accepted" },
          {
            $set: {
              "primary.status": "begin",
              "primary.isBegin": req.body.isStatus,
              "primary.beginAt": Math.round(new Date() / 1000),
              "primary.beginMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "primary", "begin", 25);
      } else if (req.body.status === "begin" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "primary.status": "accepted",
              "primary.isBegin": req.body.isStatus,
            },
          }
        );
      }

      //code ends for  begin to accepted and vice-versa
      else if (req.body.status === "completed" && req.body.isStatus == true) {
        if (production.primary.status != "begin") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to start the production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "primary.status": "completed",
              "primary.isCompleted": req.body.isStatus,
              "primary.completedAt": Math.round(new Date() / 1000),
              "primary.completedMessage": req.body.message,
            },
          }
        );
        await createActivity(production, "primary", "productionCompleted");
      } else if (req.body.status === "completed" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "primary.status": "begin",
              "primary.isCompleted": req.body.isStatus,
            },
          }
        );
      }
      // for quality assurance begin
      else if (req.body.status == "qaBegins" && production.primary.status === "completed" && req.body.isStatus == true) {
        if (production.primary.status != "completed") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to select the quality Assurance production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "primary.status": "qaBegins",
              "primary.isQualityBegin": req.body.isStatus,
              "primary.qualityBeginAt": Math.round(new Date() / 1000),
              "primary.qualityBeginMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "primary", "qaBegin", 50);
      } else if (req.body.status === "qaBegins" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "primary.status": "qualityAssurance",
              "primary.isQualityBegin": req.body.isStatus,
            },
          }
        );
      }

      // for quality assurance completed
      else if (req.body.status == "qaCompleted" && production.primary.status === "qaBegins" && req.body.isStatus == true) {
        if (production.primary.status != "qaBegins") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to begin the quality Assurance production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "primary.status": "qaCompleted",
              "primary.isQualityCompleted": req.body.isStatus,
              "primary.qaImages": req.body.qaImages,
              "primary.qualityCompletedAt": Math.round(new Date() / 1000),
              "primary.qualityCompleteMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "primaryCompleted", "qaCompleted", 75);
      } else if (req.body.status === "qaCompleted" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "primary.status": "qaBegins",
              "primary.isisQualityCompleted": req.body.isStatus,
            },
          }
        );
      } else if (req.body.status === "shipped" && req.body.isStatus == true) {
        if (production.primary.status != "qaCompleted") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to complete the quality of the order",
          });
        }
        //tbd compare with shipping date specfied and when product is ready
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "primary.status": "shipped",
              "primary.isShipped": req.body.isStatus,
              "primary.shippedAt": Math.round(new Date() / 1000),
              "primary.shippedMessage": req.body.message,
            },
          }
        );

        if (cart.isPaymentDone === false) {
          await sendMail(production, "shipped");
        }
        await sendMail(production, "primary");
        await saveActivity(production, "primary", "shipped", 80);
      } else if (req.body.status === "shipped" && req.body.isStatus == false) {
        //tbd compare with shipping date specfied and when product is ready
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "primary.status": "qaCompleted",
              "primary.isShipped": req.body.isStatus,
            },
          }
        );
      } else if (req.body.status === "delivered" && req.body.isStatus == true) {
        //tbd compare with shipping date specfied and when product is ready
        if (production.secondary.isDelivered === true && production.formulation.isDelivered === true && production.label.isDelivered === true) {
          console.log("going in delivery");
          const res = await Production.updateOne(
            { _id: req.body.productionId },
            {
              $set: {
                productStatus: "delivered",
                "primary.status": "delivered",
                "primary.isDelivered": req.body.isStatus,
                "primary.deliveredAt": Math.round(new Date() / 1000),
                "primary.deliveredMessage": req.body.message,
                isDelivered: true,
              },
            }
          );
          console.log(res, "resssss");
          await Cart.updateOne(
            { _id: production.cartId },
            {
              $set: {
                status: "delivered",
                "primary.status": "delivered",
              },
            }
          );
          await User.updateOne({ _id: production.userId }, { $inc: { totalProductsInProduction: -1 } });
          await saveActivity(production, "primary", "delivered", 100);
        } else {
          await Production.updateOne(
            { _id: req.body.productionId },
            {
              $set: {
                "primary.status": "delivered",
                "primary.isDelivered": req.body.isStatus,
                "primary.deliveredAt": Math.round(new Date() / 1000),
                "primary.deliveredMessage": req.body.message,
              },
            }
          );
          await Cart.updateOne(
            { _id: production.cartId },
            {
              $set: {
                "primary.status": "delivered",
              },
            }
          );
          await saveActivity(production, "primary", "delivered", 100);
        }
      } else {
        return res.status(400).send({
          statusCode: 400,
          status: "Failure",
          data: "Sorry,Unable to process your request,You can't go backward!",
        });
      }
    }
  }

  //SECONDARY
  if (req.body.type == "secondary") {
    if (req.body.shippingUrl) {
      await Production.updateOne({ _id: req.body.productionId }, { $set: { "secondary.shippingUrl": req.body.shippingUrl } });
    } else {
      //code begin for  begin to accepted and vice-versa
      if (req.body.status === "begin" && req.body.isStatus == true) {
        if (production.secondary.status != "accepted") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to accept the order for production",
          });
        }
        await Cart.updateOne(
          { _id: production.cartId, status: "submitted" },
          {
            $set: {
              "secondary.status": "inProgress",
              "secondary.isProgress": req.body.isStatus,
            },
          }
        );
        await Production.updateOne(
          { _id: req.body.productionId, "secondary.status": "accepted" },
          {
            $set: {
              "secondary.status": "begin",
              "secondary.isBegin": req.body.isStatus,
              "secondary.beginAt": Math.round(new Date() / 1000),
              "secondary.beginMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "secondary", "begin", 25);
      } else if (req.body.status === "begin" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "secondary.status": "production",
              "secondary.isBegin": req.body.isStatus,
            },
          }
        );
      }

      //code ends for  begin to accepted and vice-versa
      else if (req.body.status === "completed" && req.body.isStatus == true) {
        if (production.secondary.status != "begin") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to start the production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "secondary.status": "completed",
              "secondary.isCompleted": req.body.isStatus,
              "secondary.completedAt": Math.round(new Date() / 1000),
              "secondary.completedMessage": req.body.message,
            },
          }
        );
        await createActivity(production, "secondary", "productionCompleted");
      } else if (req.body.status === "completed" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "secondary.status": "begin",
              "secondary.isCompleted": req.body.isStatus,
            },
          }
        );
      }
      // for quality assurance begin
      else if (req.body.status == "qaBegins" && production.secondary.status === "completed" && req.body.isStatus == true) {
        if (production.secondary.status != "completed") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to select the complete production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "secondary.status": "qaBegins",
              "secondary.isQualityBegin": req.body.isStatus,
              "secondary.qualityBeginAt": Math.round(new Date() / 1000),
              "secondary.qualityBeginMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "secondary", "qaBegin", 50);
      } else if (req.body.status === "qaBegins" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "secondary.status": "completed",
              "secondary.isQualityBegin": req.body.isStatus,
            },
          }
        );
      }

      // for quality assurance completed
      else if (req.body.status == "qaCompleted" && production.secondary.status === "qaBegins" && req.body.isStatus == true) {
        if (production.secondary.status != "qaBegins") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to begin the quality Assurance production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "secondary.status": "qaCompleted",
              "secondary.isQualityCompleted": req.body.isStatus,
              "secondary.qaImages": req.body.qaImages,
              "secondary.qualityCompletedAt": Math.round(new Date() / 1000),
              "secondary.qualityCompleteMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "secondaryCompleted", "qaCompleted", 75);
      } else if (req.body.status === "qaCompleted" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "secondary.status": "qaBegins",
              "secondary.isisQualityCompleted": req.body.isStatus,
            },
          }
        );
      } else if (req.body.status === "shipped" && req.body.isStatus == true) {
        if (production.secondary.status != "qaCompleted") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to check the quality of the order",
          });
        }
        //tbd compare with shipping date specfied and when product is ready
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "secondary.status": "shipped",
              "secondary.isShipped": req.body.isStatus,
              "secondary.shippedAt": Math.round(new Date() / 1000),
              "secondary.shippedMessage": req.body.message,
            },
          }
        );

        if (cart.isPaymentDone === false) {
          await sendMail(production, "shipped");
        }
        await sendMail(production, "secondary");
        await saveActivity(production, "secondary", "shipped", 80);
      } else if (req.body.status === "shipped" && req.body.isStatus == false) {
        //tbd compare with shipping date specfied and when product is ready
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "secondary.status": "qaCompleted",
              "secondary.isShipped": req.body.isStatus,
            },
          }
        );
      } else if (req.body.status === "delivered" && req.body.isStatus == true) {
        //tbd compare with shipping date specfied and when product is ready
        if (production.primary.isDelivered === true && production.formulation.isDelivered === true && production.label.isDelivered === true) {
          console.log("going in delivery");
          await Production.updateOne(
            { _id: req.body.productionId },
            {
              $set: {
                productStatus: "delivered",
                "secondary.status": "delivered",
                "secondary.isDelivered": req.body.isStatus,
                "secondary.deliveredAt": Math.round(new Date() / 1000),
                "secondary.deliveredMessage": req.body.message,
                isDelivered: true,
              },
            }
          );
          await Cart.updateOne(
            { _id: production.cartId },
            {
              $set: {
                status: "delivered",
                "secondary.status": "delivered",
              },
            }
          );
          await User.updateOne({ _id: production.userId }, { $inc: { totalProductsInProduction: -1 } });
          await saveActivity(production, "secondary", "delivered", 100);
        } else {
          await Production.updateOne(
            { _id: req.body.productionId },
            {
              $set: {
                "secondary.status": "delivered",
                "secondary.isDelivered": req.body.isStatus,
                "secondary.deliveredAt": Math.round(new Date() / 1000),
                "secondary.deliveredMessage": req.body.message,
              },
            }
          );
          await Cart.updateOne(
            { _id: production.cartId },
            {
              $set: {
                "secondary.status": "delivered",
              },
            }
          );
          await saveActivity(production, "secondary", "delivered", 100);
        }
      } else {
        return res.status(400).send({
          statusCode: 400,
          status: "Failure",
          data: "Sorry,Unable to process your request,You can't go backward!",
        });
      }
    }
  }

  //FORMULATION
  if (req.body.type == "formulation") {
    if (req.body.shippingUrl) {
      await Production.updateOne({ _id: req.body.productionId }, { $set: { "formulation.shippingUrl": req.body.shippingUrl } });
    } else {
      //code begin for  begin to accepted and vice-versa
      if (req.body.status === "begin" && req.body.isStatus == true) {
        if (production.formulation.status != "accepted") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to accept the order for production",
          });
        }
        await Cart.updateOne(
          { _id: production.cartId, status: "submitted" },
          {
            $set: {
              "formulation.status": "inProgress",
              "formulation.isProgress": req.body.isStatus,
            },
          }
        );
        await Production.updateOne(
          { _id: req.body.productionId, "formulation.status": "accepted" },
          {
            $set: {
              "formulation.status": "begin",
              "formulation.isBegin": req.body.isStatus,
              "formulation.beginAt": Math.round(new Date() / 1000),
              "formulation.beginMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "formulation", "inProduction", 25);
      } else if (req.body.status === "begin" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "formulation.status": "production",
              "formulation.isBegin": req.body.isStatus,
            },
          }
        );
      }

      //code ends for  begin to accepted and vice-versa
      else if (req.body.status === "completed" && req.body.isStatus == true) {
        if (production.formulation.status != "begin") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to start the production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "formulation.status": "completed",
              "formulation.isCompleted": req.body.isStatus,
              "formulation.completedAt": Math.round(new Date() / 1000),
              "formulation.completedMessage": req.body.message,
            },
          }
        );
        await createActivity(production, "formulation", "productionCompleted");
      } else if (req.body.status === "completed" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "formulation.status": "begin",
              "formulation.isCompleted": req.body.isStatus,
            },
          }
        );
      }
      // for quality assurance begin
      else if (req.body.status == "qaBegins" && production.formulation.status === "completed" && req.body.isStatus == true) {
        if (production.formulation.status != "completed") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to select the complete production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "formulation.status": "qaBegins",
              "formulation.isQualityBegin": req.body.isStatus,
              "formulation.qualityBeginAt": Math.round(new Date() / 1000),
              "formulation.qualityBeginMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "formulation", "qaBegin", 50);
      } else if (req.body.status === "qaBegins" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "formulation.status": "qualityAssurance",
              "formulation.isQualityBegin": req.body.isStatus,
            },
          }
        );
      }

      // for quality assurance completed
      else if (req.body.status == "qaCompleted" && production.formulation.status === "qaBegins" && req.body.isStatus == true) {
        if (production.formulation.status != "qaBegins") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to begin the quality Assurance production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "formulation.status": "qaCompleted",
              "formulation.isQualityCompleted": req.body.isStatus,
              "formulation.qaImages": req.body.qaImages,
              "formulation.qualityCompletedAt": Math.round(new Date() / 1000),
              "formulation.qualityCompleteMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "formulationCompleted", "qaCompleted", 75);
      } else if (req.body.status === "qaCompleted" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "formulation.status": "qaBegins",
              "formulation.isQualityCompleted": req.body.isStatus,
            },
          }
        );
      } else if (req.body.status === "shipped" && req.body.isStatus == true) {
        if (production.formulation.status != "qaCompleted") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to check the quality of the order",
          });
        }
        //tbd compare with shipping date specfied and when product is ready
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "formulation.status": "shipped",
              "formulation.isShipped": req.body.isStatus,
              "formulation.shippedAt": Math.round(new Date() / 1000),
              "formulation.shippedMessage": req.body.message,
            },
          }
        );

        if (cart.isPaymentDone === false) {
          await sendMail(production, "shipped");
        }
        await sendMail(production, "formulation");
        await saveActivity(production, "formulation", "shipped", 80);
      } else if (req.body.status === "shipped" && req.body.isStatus == false) {
        //tbd compare with shipping date specfied and when product is ready
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "formulation.status": "qaCompleted",
              "formulation.isShipped": req.body.isStatus,
            },
          }
        );
      } else if (req.body.status === "delivered" && req.body.isStatus == true) {
        //tbd compare with shipping date specfied and when product is ready
        if (production.primary.isDelivered === true && production.secondary.isDelivered === true && production.label.isDelivered === true) {
          console.log("going in delivery");
          await Production.updateOne(
            { _id: req.body.productionId },
            {
              $set: {
                productStatus: "delivered",
                "formulation.status": "delivered",
                "formulation.isDelivered": req.body.isStatus,
                "formulation.deliveredAt": Math.round(new Date() / 1000),
                "formulation.deliveredMessage": req.body.message,
                isDelivered: true,
              },
            }
          );
          await Cart.updateOne(
            { _id: production.cartId },
            {
              $set: {
                status: "delivered",
                "formulation.status": "delivered",
              },
            }
          );
          await User.updateOne({ _id: production.userId }, { $inc: { totalProductsInProduction: -1 } });
        } else {
          await Production.updateOne(
            { _id: req.body.productionId },
            {
              $set: {
                "formulation.status": "delivered",
                "formulation.isDelivered": req.body.isStatus,
                "formulation.deliveredAt": Math.round(new Date() / 1000),
                "formulation.deliveredMessage": req.body.message,
              },
            }
          );
          await Cart.updateOne(
            { _id: production.cartId },
            {
              $set: {
                "formulation.status": "delivered",
              },
            }
          );
          await saveActivity(production, "formulation", "delivered", 100);
        }
      } else {
        return res.status(400).send({
          statusCode: 400,
          status: "Failure",
          data: "Sorry,Unable to process your request,You can't go backward!",
        });
      }
    }
  }

  //label
  if (req.body.type == "label") {
    if (req.body.shippingUrl) {
      await Production.updateOne({ _id: req.body.productionId }, { $set: { "label.shippingUrl": req.body.shippingUrl } });
    } else {
      //case from submitted to accepted and vice-versa

      //code begin for  begin to accepted and vice-versa
      if (req.body.status === "begin" && req.body.isStatus == true) {
        if (production.label.status != "accepted") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to accept the order production",
          });
        }
        await Cart.updateOne(
          { _id: production.cartId, status: "accepted" },
          {
            $set: {
              "label.status": "inProgress",
              "label.isProgress": req.body.isStatus,
            },
          }
        );
        await Production.updateOne(
          { _id: req.body.productionId, "label.status": "accepted" },
          {
            $set: {
              "label.status": "begin",
              "label.isBegin": req.body.isStatus,
              "label.beginAt": Math.round(new Date() / 1000),
              "label.beginMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "label", "begin", 25);
      } else if (req.body.status === "begin" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "label.status": "production",
              "label.isBegin": req.body.isStatus,
            },
          }
        );
      }

      //code ends for  begin to accepted and vice-versa
      else if (req.body.status === "completed" && req.body.isStatus == true) {
        if (production.label.status != "begin") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to start the production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "label.status": "completed",
              "label.isCompleted": req.body.isStatus,
              "label.completedAt": Math.round(new Date() / 1000),
              "label.completedMessage": req.body.message,
            },
          }
        );
        await createActivity(production, "label", "productionCompleted");
      } else if (req.body.status === "completed" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "label.status": "begin",
              "label.isCompleted": req.body.isStatus,
              "label.completedAt": Math.round(new Date() / 1000),
            },
          }
        );
      }
      // for qa begin
      else if (req.body.status == "qaBegins" && production.label.status === "completed" && req.body.isStatus == true) {
        if (production.label.status != "completed") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to select the completed production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "label.status": "qaBegins",
              "label.isQualityBegin": req.body.isStatus,
              "label.qualityBeginAt": Math.round(new Date() / 1000),
              "label.qualityBeginMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "label", "qaBegin", 50);
      } else if (req.body.status === "qaBegins" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "label.status": "completed",
              "label.isQualityBegin": req.body.isStatus,
            },
          }
        );
      }

      // for quality assurance completed
      else if (req.body.status == "qaCompleted" && production.label.status === "qaBegins" && req.body.isStatus == true) {
        if (production.label.status != "qaBegins") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to begin the quality Assurance production of the  order",
          });
        }
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "label.status": "qaCompleted",
              "label.isQualityCompleted": req.body.isStatus,
              "label.qaImages": req.body.qaImages,
              "label.qualityCompletedAt": Math.round(new Date() / 1000),
              "label.qualityCompleteMessage": req.body.message,
            },
          }
        );
        await saveActivity(production, "labelCompleted", "qaCompleted", 75);
      } else if (req.body.status === "qaCompleted" && req.body.isStatus == false) {
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "label.status": "qaBegins",
              "label.isQualityCompleted": req.body.isStatus,
            },
          }
        );
      } else if (req.body.status === "shipped" && req.body.isStatus == true) {
        if (production.label.status != "qaCompleted") {
          return res.status(400).send({
            statusCode: 400,
            status: "Failure",
            data: "First you need to check the quality of the order",
          });
        }
        //tbd compare with shipping date specfied and when product is ready
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "label.status": "shipped",
              "label.isShipped": req.body.isStatus,
              "label.shippedAt": Math.round(new Date() / 1000),
              "label.shippedMessage": req.body.message,
            },
          }
        );

        if (cart.isPaymentDone === false) {
          await sendMail(production, "shipped");
        }
        await sendMail(production, "label");
        await saveActivity(production, "label", "shipped", 80);
      } else if (req.body.status === "shipped" && req.body.isStatus == false) {
        //tbd compare with shipping date specfied and when product is ready
        await Production.updateOne(
          { _id: req.body.productionId },
          {
            $set: {
              "label.status": "qaCompleted",
              "label.isShipped": req.body.isStatus,
              "label.shippedAt": Math.round(new Date() / 1000),
            },
          }
        );
      } else if (req.body.status === "delivered" && req.body.isStatus == true) {
        //tbd compare with shipping date specfied and when product is ready
        if (production.primary.isDelivered === true && production.secondary.isDelivered === true && production.formulation.isDelivered === true) {
          console.log("going in delivery");
          await Production.updateOne(
            { _id: req.body.productionId },
            {
              $set: {
                productStatus: "delivered",
                "label.status": "delivered",
                "label.isDelivered": req.body.isStatus,
                "label.deliveredAt": Math.round(new Date() / 1000),
                "label.deliveredMessage": req.body.message,
                isDelivered: true,
              },
            }
          );
          await Cart.updateOne(
            { _id: production.cartId },
            {
              $set: {
                status: "delivered",
                "label.status": "delivered",
              },
            }
          );
          await User.updateOne({ _id: production.userId }, { $inc: { totalProductsInProduction: -1 } });
          await saveActivity(production, "label", "delivered", 100);
        } else {
          await Production.updateOne(
            { _id: req.body.productionId },
            {
              $set: {
                "label.status": "delivered",
                "label.isDelivered": req.body.isStatus,
                "label.deliveredAt": Math.round(new Date() / 1000),
                "label.deliveredMessage": req.body.message,
              },
            }
          );

          await Cart.updateOne(
            { _id: production.cartId },
            {
              $set: {
                "label.status": "delivered",
              },
            }
          );
          await saveActivity(production, "label", "delivered", 100);
        }
      } else {
        return res.status(400).send({
          statusCode: 400,
          status: "Failure",
          data: "Sorry,Unable to process your request,You can't go backward!",
        });
      }
    }
  }

  if (req.body.status == "accepted") {
    let production = await Production.findById(req.body.productionId);
    if (production.primary.isAccepted == true && production.secondary.isAccepted == true && production.formulation.isAccepted == true && production.label.isAccepted == true) {
      await Activity.create({
        userId: production.userId,
        productId: production.productId,
        type: "allAccepted",
        productType: "inProduction",
      });
      let user = await User.findOne({ _id: production.userId });
      let product = await Product.findOne({ _id: production.productId });
      let emailData = {
        email: user.email,
        username: user.fullName,
        productName: product.name,
        subject: config.get("email.productAcceptedTitle"),
      };
      let result = await sendAcceptedMail(emailData);
      if (result.code) {
        return res.status(500).send({
          message: "Failure",
          statusCode: 500,
          data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE,
        });
      }
    }
  }
  if (req.body.productStatus && req.body.productStatus != "delivered") {
    await Production.updateOne(
      { _id: req.body.productionId },
      {
        $set: {
          productStatus: req.body.productStatus,
        },
      }
    );
  } else if (req.body.productStatus && req.body.productStatus == "delivered") {
    await Production.updateOne(
      { _id: req.body.productionId },
      {
        $set: {
          productStatus: req.body.productStatus,
          isDelivered: true,
        },
      }
    );
    await Cart.updateOne(
      { _id: production.cartId },
      {
        $set: {
          status: "delivered",
        },
      }
    );
    await User.updateOne({ _id: production.userId }, { $inc: { totalProductsInProduction: -1 } });
  }

  let tempProduction = await Production.findOne({ _id: req.body.productionId });
  let product = await Product.findOne(
    { _id: tempProduction.productId },
    {
      _id: 0,
      primaryPackaging: 1,
      secondaryPackaging: 1,
      formulationPackaging: 1,
    }
  );

  let newProduction = _.merge(tempProduction, product);
  res.send({
    statusCode: 200,
    status: "Success",
    data: { newProduction: newProduction },
  });
});

//get all productions
router.get("/", userAdminAuth, async (req, res) => {
  let criteria = {};
  if (req.jwtData.role === "user") {
    criteria.userId = req.jwtData.userId;
    var shippingData = await Shipping.findOne({ userId: req.jwtData.userId, status: "active" }, { _id: 0, sampleAddress: 1, warehouseAddress: 1 });
  }
  if (req.jwtData.role == "admin") {
    if (req.query.userId) {
      criteria.userId = req.query.userId;
      var shippingData = await Shipping.findOne({ userId: req.query.userId, status: "active" }, { _id: 0, sampleAddress: 1, warehouseAddress: 1 });
    }
  }
  var skipVal, limitVal;
  if (isNaN(parseInt(req.query.offset))) skipVal = 0;
  else skipVal = parseInt(req.query.offset);

  if (isNaN(parseInt(req.query.limit))) limitVal = 20;
  else limitVal = parseInt(req.query.limit);

  // if (req.body.productStatus == "delivered") {
  //   criteria.productStatus = "delivered";
  // } else {
  //   criteria.productStatus = { $ne: "delivered" };
  // }
  let productionList = await Production.aggregate([
    {
      $match: criteria,
    },
    { $skip: skipVal },
    { $limit: limitVal },
    {
      $addFields: {
        productId: { $toObjectId: "$productId" },
        cartId: { $toObjectId: "$cartId" },
        userId: { $toString: "$userId" },
        productionId: { $toString: "$_id" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productData",
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "userId",
        foreignField: "userId",
        as: "companyData",
      },
    },
    {
      $lookup: {
        from: "carts",
        localField: "cartId",
        foreignField: "_id",
        as: "cartData",
      },
    },

    {
      $lookup: {
        from: "recorddelays",
        let: {
          productionId: "$productionId",
        },
        pipeline: [
          {
            $match: {
              $and: [{ $expr: { $eq: ["$productionId", "$$productionId"] } }, { $expr: { $eq: ["$packagingType", "primary"] } }],
            },
          },
          {
            $project: {
              _id: 0,
              recordId: "$_id",
              days: 1,
              reason: 1,
              productType: 1,
              packagingType: 1,
              insertDate: 1,
            },
          },
        ],
        as: "recordDelayPrimary",
      },
    },
    {
      $lookup: {
        from: "recorddelays",
        let: {
          productionId: "$productionId",
        },
        pipeline: [
          {
            $match: {
              $and: [{ $expr: { $eq: ["$productionId", "$$productionId"] } }, { $expr: { $eq: ["$packagingType", "secondary"] } }],
            },
          },
          {
            $project: {
              _id: 0,
              recordId: "$_id",
              days: 1,
              reason: 1,
              productType: 1,
              packagingType: 1,
              insertDate: 1,
            },
          },
        ],
        as: "recordDelaySecondary",
      },
    },
    {
      $lookup: {
        from: "recorddelays",
        let: {
          productionId: "$productionId",
        },
        pipeline: [
          {
            $match: {
              $and: [{ $expr: { $eq: ["$productionId", "$$productionId"] } }, { $expr: { $eq: ["$packagingType", "formulation"] } }],
            },
          },
          {
            $project: {
              _id: 0,
              recordId: "$_id",
              days: 1,
              reason: 1,
              productType: 1,
              packagingType: 1,
              insertDate: 1,
            },
          },
        ],
        as: "recordDelayFormulation",
      },
    },

    {
      $lookup: {
        from: "recorddelays",
        let: {
          productionId: "$productionId",
        },
        pipeline: [
          {
            $match: {
              $and: [{ $expr: { $eq: ["$productionId", "$$productionId"] } }, { $expr: { $eq: ["$packagingType", "label"] } }],
            },
          },
          {
            $project: {
              _id: 0,
              recordId: "$_id",
              days: 1,
              reason: 1,
              productType: 1,
              packagingType: 1,
              insertDate: 1,
            },
          },
        ],
        as: "recordDelayLabel",
      },
    },
    {
      $project: {
        _id: 0,
        productionId: "$_id",
        quantity: 1,
        totalAmount: 1,
        status: 1,
        orderId: { $arrayElemAt: ["$cartData.orderId", 0] },
        insertDate: 1,
        creationDate: 1,
        userData: 1,
        primary: 1,
        secondary: 1,
        formulation: 1,
        label: 1,
        isDelivered: 1,
        productStatus: 1,
        company: { $arrayElemAt: ["$companyData.name", 0] },
        productId: { $arrayElemAt: ["$productData._id", 0] },
        name: { $arrayElemAt: ["$productData.name", 0] },
        volume: { $arrayElemAt: ["$productData.volume", 0] },
        heroImage: { $arrayElemAt: ["$productData.heroImage", 0] },
        primaryPackaging: {
          $arrayElemAt: ["$productData.primaryPackaging", 0],
        },
        secondaryPackaging: {
          $arrayElemAt: ["$productData.secondaryPackaging", 0],
        },
        formulationPackaging: {
          $arrayElemAt: ["$productData.formulationPackaging", 0],
        },
        carbonOffset: { $arrayElemAt: ["$productData.carbonOffset", 0] },
        productstatus: { $arrayElemAt: ["$productData.status", 0] },
        compliance: { $arrayElemAt: ["$productData.compliance", 0] },
        pricing: { $arrayElemAt: ["$productData.pricing", 0] },
        manufacturingPlace: {
          $arrayElemAt: ["$productData.manufacturingPlace", 0],
        },
        pricing: { $arrayElemAt: ["$productData.pricing", 0] },
        manufacturingPlace: {
          $arrayElemAt: ["$productData.manufacturingPlace", 0],
        },
        labelPackaging: { $arrayElemAt: ["$productData.labelPackaging", 0] },
        recordDelayPrimary: 1,
        recordDelaySecondary: 1,
        recordDelayFormulation: 1,
        recordDelayLabel: 1,
      },
    },
  ]);
  return res.send({
    statusCode: 200,
    message: "Success",
    data: { productionList, shippingData },
  });
});

//get speicific details of production based on production id
router.get("/:productionId", async (req, res) => {
  let criteria = {};
  criteria._id = mongoose.Types.ObjectId(req.params.productionId);
  let productionList = await Production.aggregate([
    {
      $match: criteria,
    },
    {
      $addFields: {
        productId: { $toObjectId: "$productId" },
        cartId: { $toObjectId: "$cartId" },
        userId: { $toString: "$userId" },
        productionId: { $toString: "$_id" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productData",
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "userId",
        foreignField: "userId",
        as: "companyData",
      },
    },
    {
      $lookup: {
        from: "carts",
        localField: "cartId",
        foreignField: "_id",
        as: "cartData",
      },
    },

    {
      $lookup: {
        from: "recorddelays",
        let: {
          productionId: "$productionId",
        },
        pipeline: [
          {
            $match: {
              $and: [{ $expr: { $eq: ["$productionId", "$$productionId"] } }, { $expr: { $eq: ["$packagingType", "primary"] } }],
            },
          },
          {
            $project: {
              _id: 0,
              recordId: "$_id",
              days: 1,
              reason: 1,
              productType: 1,
              packagingType: 1,
              insertDate: 1,
            },
          },
        ],
        as: "recordDelayPrimary",
      },
    },
    {
      $lookup: {
        from: "recorddelays",
        let: {
          productionId: "$productionId",
        },
        pipeline: [
          {
            $match: {
              $and: [{ $expr: { $eq: ["$productionId", "$$productionId"] } }, { $expr: { $eq: ["$packagingType", "secondary"] } }],
            },
          },
          {
            $project: {
              _id: 0,
              recordId: "$_id",
              days: 1,
              reason: 1,
              productType: 1,
              packagingType: 1,
              insertDate: 1,
            },
          },
        ],
        as: "recordDelaySecondary",
      },
    },
    {
      $lookup: {
        from: "recorddelays",
        let: {
          productionId: "$productionId",
        },
        pipeline: [
          {
            $match: {
              $and: [{ $expr: { $eq: ["$productionId", "$$productionId"] } }, { $expr: { $eq: ["$packagingType", "formulation"] } }],
            },
          },
          {
            $project: {
              _id: 0,
              recordId: "$_id",
              days: 1,
              reason: 1,
              productType: 1,
              packagingType: 1,
              insertDate: 1,
            },
          },
        ],
        as: "recordDelayFormulation",
      },
    },
    {
      $lookup: {
        from: "recorddelays",
        let: {
          productionId: "$productionId",
        },
        pipeline: [
          {
            $match: {
              $and: [{ $expr: { $eq: ["$productionId", "$$productionId"] } }, { $expr: { $eq: ["$packagingType", "label"] } }],
            },
          },
          {
            $project: {
              _id: 0,
              recordId: "$_id",
              days: 1,
              reason: 1,
              productType: 1,
              packagingType: 1,
              insertDate: 1,
            },
          },
        ],
        as: "recordDelayLabel",
      },
    },
    {
      $project: {
        _id: 0,
        productionId: "$_id",
        quantity: 1,
        totalAmount: 1,
        status: 1,
        orderId: { $arrayElemAt: ["$cartData.orderId", 0] },
        insertDate: 1,
        creationDate: 1,
        userData: 1,
        primary: 1,
        secondary: 1,
        formulation: 1,
        label: 1,
        isDelivered: 1,
        productStatus: 1,
        company: { $arrayElemAt: ["$companyData.name", 0] },
        productId: { $arrayElemAt: ["$productData._id", 0] },
        name: { $arrayElemAt: ["$productData.name", 0] },
        volume: { $arrayElemAt: ["$productData.volume", 0] },
        heroImage: { $arrayElemAt: ["$productData.heroImage", 0] },
        primaryPackaging: {
          $arrayElemAt: ["$productData.primaryPackaging", 0],
        },
        secondaryPackaging: {
          $arrayElemAt: ["$productData.secondaryPackaging", 0],
        },
        formulationPackaging: {
          $arrayElemAt: ["$productData.formulationPackaging", 0],
        },
        carbonOffset: { $arrayElemAt: ["$productData.carbonOffset", 0] },
        productstatus: { $arrayElemAt: ["$productData.status", 0] },
        compliance: { $arrayElemAt: ["$productData.compliance", 0] },
        pricing: { $arrayElemAt: ["$productData.pricing", 0] },
        manufacturingPlace: {
          $arrayElemAt: ["$productData.manufacturingPlace", 0],
        },
        labelPackaging: { $arrayElemAt: ["$productData.labelPackaging", 0] },
        recordDelayPrimary: 1,
        recordDelaySecondary: 1,
        recordDelayFormulation: 1,
        recordDelayLabel: 1,
      },
    },
  ]);
  return res.send({
    statusCode: 200,
    message: "Success",
    data: { productionList },
  });
});

router.delete("/:id", userAuth, async (req, res) => {
  let cart = await Cart.deleteOne({ _id: req.params.id });
  if (cart.deletedCount) {
    await User.updateOne({ _id: req.jwtData.userId }, { $inc: { totalProductsInCart: -1 } });
    return res.send({
      statusCode: 200,
      message: "Success",
      data: CART_CONSTANTS.DELETE_SUCCESS,
    });
  } else {
    return res.status(400).send({
      statusCode: 400,
      message: "Failure",
      data: CART_CONSTANTS.INVALID_ID,
    });
  }
});

async function sendMail(production, type) {
  let user = await User.findOne({ _id: production.userId });
  let product = await Product.findOne({ _id: production.productId });
  let cart = await Cart.findOne({ _id: production.cartId });
  let emailData = {
    email: user.email,
    userName: user.fullName,
    productName: product.name,
    component: type,
    subject: config.get("email.shippedTitle"),
  };
  if (type === "shipped") {
    let data = {
      name: user.fullName || "dummy",
    };
    emailData = {
      email: user.email,
      name: data.name,
      productName: product.name,
      amountLeft: cart.amountLeft,
      text: formatter(config.get("email.productAdded"), data),
      subject: config.get("email.productShippedTitle"),
    };
    let result = await sendProductShippedMail(emailData);
    if (result.code) {
      return res.status(500).send({ message: "Failure", statusCode: 500, data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE });
    }
  } else {
    await trackingMail(emailData);
  }
}

async function saveActivity(production, type, productStatus, percent) {
  await Activity.create({
    userId: production.userId,
    productId: production.productId,
    type: type,
    productType: productStatus,
    percentage: percent,
    productionId: production._id,
  });
}

async function createActivity(production, type, productStatus) {
  await Activity.create({
    userId: production.userId,
    productId: production.productId,
    type: type,
    productType: productStatus,
    productionId: production._id,
  });
}

module.exports = router;
