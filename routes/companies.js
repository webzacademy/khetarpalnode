const { COMPANY_CONSTANTS } = require("../config/constant.js");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { userAdminAuth, adminAuth } = require("../middleware/auth");
const _ = require("lodash");
const { User } = require("../models/user");
const { Company, validateCompanyPost, validateCompanyPut } = require("../models/company");
//------------------------------------------------------------------------------------------------------------------
//create company
router.post("/", adminAuth, async (req, res) => {
  const { error } = validateCompanyPost(req.body);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });

  let company = new Company(_.pick(req.body, ["userId", "name", "abn", "type", "address"]));
  company.status = "active";
  try {
    await company.save();
  } catch (Ex) {
    console.log(Ex);
    if (Ex.code === 11000)
      return res.status(400).send({ statusCode: 400, message: "Failure", data: COMPANY_CONSTANTS.DUPLICATE_COMPANY });
    else return res.status(400).send({ statusCode: 400, message: "Failure", data: COMPANY_CONSTANTS.SYSTEM_FAILURE });
  }
  await User.updateOne({ _id: req.body.userId }, { $set: { isCompanyAdded: true } });

  return res.send({ statusCode: 200, message: "Success", data: COMPANY_CONSTANTS.SUBMIT_SUCCESS });
});
//update company
router.put("/", userAdminAuth, async (req, res) => {
  const { error } = validateCompanyPut(req.body);
  if (error) return res.status(400).send({ statusCode: 400, message: "Failure", data: error.details[0].message });

  let company = await Company.findById(req.body.companyId);
  if (!company) {
    return res.status(400).send({ statusCode: 400, message: "Failure", data: COMPANY_CONSTANTS.INVALID_ID });
  }

  company.name = req.body.name || company.name;
  company.abn = req.body.abn || company.abn;
  company.address = req.body.address || company.address;
  company.city = req.body.city || company.city;
  company.zip = req.body.zip || company.zip;
  company.country = req.body.country || company.country;
  company.state = req.body.state || company.state;
  await company.save();
  return res.send({ statusCode: 200, message: "Success", data: { company } });
});

module.exports = router;
