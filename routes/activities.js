const { ACTIVITY_CONSTANTS } = require("../config/constant.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const config = require("config");
const { Activity } = require("../models/activity");
const formatter = require("../services/commonFunctions");
const { User } = require("../models/user");
const { userAuth } = require("../middleware/auth");
//------------------------------------------------------------------------------------------------------------

// get project
router.get("/", userAdminAuth, async (req, res) => {
  var skipVal, limitVal;
  if (isNaN(parseInt(req.query.offset))) skipVal = 0;
  else skipVal = parseInt(req.query.offset);

  if (isNaN(parseInt(req.query.limit))) limitVal = 20;
  else limitVal = parseInt(req.query.limit);

  let criteria = {};
  console.log(req.jwtData);
  if (req.jwtData.role == "user") criteria.userId = req.jwtData.userId;
  else criteria.userId = req.query.userId;
  let activity = await Activity.find({ userId: criteria.userId });
  if (!activity)
    return res.status(400).send({ statusCode: 400, status: "Failure", data: ACTIVITY_CONSTANTS.INVALID_ID });

  await Activity.updateMany({ userId: criteria.userId }, { $set: { isRead: true } });

  let activityArray = [];

  let activities = await Activity.aggregate([
    { $match: criteria },
    { $sort: { insertDate: -1 } },
    { $skip: skipVal },
    { $limit: limitVal },
    {
      $addFields: {
        productId: { $toObjectId: "$productId" },
        insertDate: { $toLong: "$insertDate" },
      },
    },
    { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "productData" } },
    {
      $project: {
        _id: 0,
        activityId: "$_id",
        userId: 1,
        productId: 1,
        type: 1,
        insertDate: 1,
        productType: 1,
        percentage: 1,
        days: 1,
        newDate: 1,
        productionId: 1,
        productName: { $arrayElemAt: ["$productData.name", 0] },
        heroImage: { $arrayElemAt: ["$productData.heroImage", 0] },
      },
    },
  ]);

  let activityObject = {};

  activities.forEach((element) => {
    activityObject = {};
    data = {};
    if (element.type === "newProduct") {
      data = {
        productName: element.productName,
      };
      activityObject.message = formatter(config.get("activities.newProduct"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "24HoursDelay") {
      data = {
        productName: element.productName,
      };
      activityObject.message = formatter(config.get("activities.24HoursDelay"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "deletedProduct") {
      data = {
        productName: element.productName,
      };
      activityObject.message = formatter(config.get("activities.deletedProduct"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }
    if (element.type === "submitOrder") {
      data = {
        productName: element.productName,
        insertDate: element.insertDate,
      };
      activityObject.message = formatter(config.get("activities.submitOrder"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.productType = element.productType;
      activityObject.type = element.type;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
      activityObject.productionId = element.productionId;
    }
    if (element.type === "orderNotPlaced") {
      data = {
        productName: element.productName,
      };
      activityObject.message = formatter(config.get("activities.orderNotPlaced"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    // if (element.type === "editProduct") {
    //   data = {
    //     productName: element.productName,
    //   };
    //   activityObject.message = formatter(config.get("activities.editProduct"), data);
    //   activityObject.insertDate = element.insertDate;
    //   activityObject.type = element.type;
    //   activityObject.productName = element.productName;
    //   activityObject.heroImage = element.heroImage;
    // }

    if (element.type === "primaryAccepted") {
      data = {
        productName: element.productName,
        insertDate: element.insertDate,
      };
      activityObject.message = formatter(config.get("activities.primaryAccepted"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "secondaryAccepted") {
      data = {
        productName: element.productName,
        insertDate: element.insertDate,
      };
      activityObject.message = formatter(config.get("activities.secondaryAccepted"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.productType = element.productType;
      activityObject.type = element.type;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "formulationAccepted") {
      data = {
        productName: element.productName,
        insertDate: element.insertDate,
      };
      activityObject.message = formatter(config.get("activities.formulationAccepted"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "labelAccepted") {
      data = {
        productName: element.productName,
        insertDate: element.insertDate,
      };
      activityObject.message = formatter(config.get("activities.labelAccepted"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "primaryCompleted") {
      data = {
        productName: element.productName,
        insertDate: element.insertDate,
        percentage: element.percentage,
      };
      activityObject.message = formatter(config.get("activities.primaryCompleted"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "secondaryCompleted") {
      data = {
        productName: element.productName,
        insertDate: element.insertDate,
        percentage: element.percentage,
      };
      activityObject.message = formatter(config.get("activities.secondaryCompleted"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.productType = element.productType;
      activityObject.type = element.type;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "formulationCompleted") {
      data = {
        productName: element.productName,
        insertDate: element.insertDate,
        percentage: element.percentage,
      };
      activityObject.message = formatter(config.get("activities.formulationCompleted"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "labelCompleted") {
      data = {
        productName: element.productName,
        insertDate: element.insertDate,
        percentage: element.percentage,
      };
      activityObject.message = formatter(config.get("activities.labelCompleted"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productType = element.productType;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "primaryDelayed") {
      let tempDate = element.newDate.toISOString();
      let newDate = tempDate.substring(0, tempDate.indexOf("T"));

      data = {
        productName: element.productName,
        insertDate: element.insertDate,
        days: element.days,
        newDate: newDate,
      };
      activityObject.message = formatter(config.get("activities.primaryDelayed"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "labelDelayed") {
      let tempDate = element.newDate.toISOString();
      let newDate = tempDate.substring(0, tempDate.indexOf("T"));

      data = {
        productName: element.productName,
        insertDate: element.insertDate,
        days: element.days,
        newDate: newDate,
      };
      activityObject.message = formatter(config.get("activities.labelDelayed"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "secondaryDelayed") {
      let tempDate = element.newDate.toISOString();
      let newDate = tempDate.substring(0, tempDate.indexOf("T"));

      data = {
        productName: element.productName,
        insertDate: element.insertDate,
        days: element.days,
        newDate: newDate,
      };
      activityObject.message = formatter(config.get("activities.secondaryDelayed"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "formulationDelayed") {
      let tempDate = element.newDate.toISOString();
      let newDate = tempDate.substring(0, tempDate.indexOf("T"));

      data = {
        productName: element.productName,
        insertDate: element.insertDate,
        days: element.days,
        newDate: newDate,
      };
      activityObject.message = formatter(config.get("activities.formulationDelayed"), data);
      activityObject.insertDate = element.insertDate;
      activityObject.type = element.type;
      activityObject.productName = element.productName;
      activityObject.heroImage = element.heroImage;
    }

    if (element.type === "primary") {
      if (element.productType == "qaBegin") {
        data = {
          productName: element.productName,
          insertDate: element.insertDate,
          percentage: element.percentage,
        };
        activityObject.message = formatter(config.get("activities.primaryQaBegin"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productName = element.productName;
        activityObject.productType = element.productType;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else if (element.productType == "updated") {
        data = {
          productName: element.productName,
        };
        activityObject.message = formatter(config.get("activities.primaryUpdated"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productType = element.productType;
        activityObject.productName = element.productName;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else if (element.productType == "productionCompleted") {
        data = {
          productName: element.productName,
        };
        activityObject.message = formatter(config.get("activities.productionPrimaryCompleted"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productType = element.productType;
        activityObject.productName = element.productName;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else {
        data = {
          productName: element.productName,
          insertDate: element.insertDate,
          percentage: element.percentage,
        };
        activityObject.message = formatter(config.get("activities.primary"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productName = element.productName;
        activityObject.productType = element.productType;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      }
    }

    if (element.type === "secondary") {
      if (element.productType == "qaBegin") {
        data = {
          productName: element.productName,
          insertDate: element.insertDate,
          percentage: element.percentage,
        };
        activityObject.message = formatter(config.get("activities.secondaryQaBegin"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productName = element.productName;
        activityObject.productType = element.productType;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else if (element.productType == "updated") {
        data = {
          productName: element.productName,
        };
        activityObject.message = formatter(config.get("activities.secondaryUpdated"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productType = element.productType;
        activityObject.productName = element.productName;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else if (element.productType == "productionCompleted") {
        data = {
          productName: element.productName,
        };
        activityObject.message = formatter(config.get("activities.productionSecondaryCompleted"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productType = element.productType;
        activityObject.productName = element.productName;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else {
        data = {
          productName: element.productName,
          insertDate: element.insertDate,
          percentage: element.percentage,
        };
        activityObject.message = formatter(config.get("activities.secondary"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productName = element.productName;
        activityObject.productType = element.productType;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
        activityObject.productionId = element.productionId;
      }
    }
    if (element.type === "formulation") {
      if (element.productType == "qaBegin") {
        data = {
          productName: element.productName,
          insertDate: element.insertDate,
          percentage: element.percentage,
        };
        activityObject.message = formatter(config.get("activities.formulationQaBegin"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productName = element.productName;
        activityObject.productType = element.productType;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else if (element.productType == "updated") {
        data = {
          productName: element.productName,
        };
        activityObject.message = formatter(config.get("activities.formulationUpdated"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productType = element.productType;
        activityObject.productName = element.productName;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else if (element.productType == "productionCompleted") {
        data = {
          productName: element.productName,
        };
        activityObject.message = formatter(config.get("activities.productionFormulationCompleted"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productType = element.productType;
        activityObject.productName = element.productName;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else {
        data = {
          productName: element.productName,
          insertDate: element.insertDate,
          percentage: element.percentage,
        };
        activityObject.message = formatter(config.get("activities.formulation"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productName = element.productName;
        activityObject.productType = element.productType;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      }
    }
    if (element.type === "label") {
      if (element.productType == "qaBegin") {
        data = {
          productName: element.productName,
          insertDate: element.insertDate,
          percentage: element.percentage,
        };
        activityObject.message = formatter(config.get("activities.labelQaBegin"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productName = element.productName;
        activityObject.productType = element.productType;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else if (element.productType == "updated") {
        data = {
          productName: element.productName,
        };
        activityObject.message = formatter(config.get("activities.labelUpdated"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productType = element.productType;
        activityObject.productName = element.productName;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else if (element.productType == "productionCompleted") {
        data = {
          productName: element.productName,
        };
        activityObject.message = formatter(config.get("activities.productionLabelCompleted"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productType = element.productType;
        activityObject.productName = element.productName;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      } else {
        data = {
          productName: element.productName,
          insertDate: element.insertDate,
          percentage: element.percentage,
        };
        activityObject.message = formatter(config.get("activities.label"), data);
        activityObject.insertDate = element.insertDate;
        activityObject.type = element.type;
        activityObject.productName = element.productName;
        activityObject.productType = element.productType;
        activityObject.heroImage = element.heroImage;
        activityObject.productionId = element.productionId;
      }
    }
    if (activityObject) activityArray.push(activityObject);
  });

  return res.send({ statusCode: 200, message: "Success", data: { activityArray } });
});

module.exports = router;
