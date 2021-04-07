const { SETTING_CONSTANTS } = require("../config/constant.js");
const mongoose = require("mongoose");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const { Feedback, validatePost } = require("../models/feedback");
const { adminAuth, userAdminAuth } = require("../middleware/auth");
const { sendGeneralMail } = require("../services/sendMail");
const express = require("express");
const router = express.Router();

router.post("/", userAdminAuth, async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });

  let userId;
  if (req.jwtData.role == "user") {
    userId = req.jwtData.userId;
  }

  let user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
  if (!user) {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: SETTING_CONSTANTS.INVALID_USER });
  }

  let feedback = new Feedback({
    message: req.body.message,
    subject: req.body.subject,
    userId: req.jwtData.userId,
  });
  // feedback.email = user.email;
  await feedback.save();
  // SEND EMAIL
  const result = await sendGeneralMail(feedback);
  if (result.code) {
    return res
      .status(500)
      .send({ message: "Failure", statusCode: 500, data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE });
  }
  return res.send({ statusCode: 200, message: "Success", data: "Feedback has sent to admin successfully" });
});

module.exports = router;
