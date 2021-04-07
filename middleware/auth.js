const { MIDDLEWARE_AUTH_CONSTANTS } = require("../config/constant.js");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const { User } = require("../models/user");

userAuth = async function (req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.header("Authorization");
  if (!token)
    return res.status(401).send({ statusCode: 401, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED });

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.jwtData = decoded;

    if (decoded.role !== "user")
      return res
        .status(403)
        .send({ statusCode: 403, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.RESOURCE_FORBIDDEN });
    let user = await User.findOne({ _id: mongoose.Types.ObjectId(decoded.userId) });
    if (!user)
      return res
        .status(401)
        .send({ statusCode: 401, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED });
    req.userData = user;

    next();
  } catch (ex) {
    res.status(401).send({ statusCode: 401, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.INVALID_AUTH_TOKEN });
  }
};

adminAuth = async function (req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.header("Authorization");
  if (!token)
    return res.status(401).send({ statusCode: 401, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED });

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.jwtData = decoded;

    if (decoded.role !== "admin")
      return res
        .status(403)
        .send({ statusCode: 403, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.RESOURCE_FORBIDDEN });

    next();
  } catch (ex) {
    res.status(401).send({ statusCode: 401, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.INVALID_AUTH_TOKEN });
  }
};

userAdminAuth = async function (req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.header("Authorization");
  if (!token)
    return res.status(401).send({ statusCode: 401, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED });

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.jwtData = decoded;

    if (decoded.role === "user") {
      let user = await User.findOne({ _id: mongoose.Types.ObjectId(decoded.userId) });
      if (!user)
        return res
          .status(401)
          .send({ statusCode: 401, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED });
      req.userData = user;
    } else if (decoded.role === "admin") {
      let admin = await User.findOne({ _id: mongoose.Types.ObjectId(decoded.userId) });
      if (!admin)
        return res
          .status(401)
          .send({ statusCode: 401, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED });
    } else {
      return res
        .status(403)
        .send({ statusCode: 403, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.RESOURCE_FORBIDDEN });
    }

    next();
  } catch (ex) {
    console.log(ex);
    res.status(401).send({ statusCode: 401, message: "Failure", data: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED });
  }
};

module.exports.userAuth = userAuth;
module.exports.adminAuth = adminAuth;
module.exports.userAdminAuth = userAdminAuth;
