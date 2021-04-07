const { AUTH_CONSTANTS } = require('../config/constant.js')
const config = require('config')
const Joi = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User } = require('../models/user')
const { userAuth, providerAuth } = require('../middleware/auth')
const {
  sendResetPasswordMail,
  adminResetPasswordMail,
} = require('../services/sendMail')
const { Company } = require('../models/company')
const { Shipping } = require('../models/shipping')

const express = require('express')
const router = express.Router()

//login
router.post('/login', async (req, res) => {
  const { error } = validateLogin(req.body)
  if (error)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: error.details[0].message,
    })

  let email = req.body.email.toLowerCase()
  let user = await User.findOne({ email: email })
  if (!user) {
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_CREDENTIALS,
    })
  }

  if (user.status != 'active')
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INACTIVE_ACCOUNT,
      status: user.status,
    })

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_CREDENTIALS,
    })

  const token = user.generateAuthToken()
  user.accessToken = token

  await user.save()
  user.userId = user._id

  let response = _.pick(user, [
    'userId',
    'fullName',
    'mobile',
    'email',
    'status',
    'profilePic',
    'userType',
    'address',
    'insertDate',
    'totalProductsInCart',
    'totalProductsInProduction',
    'totalAssignedProducts',
    'city',
    'role',
    'state',
    'country',
    'zip',
  ])

  let company = await Company.findOne({ userId: user.userId })
  let shipping = await Shipping.findOne({ userId: user.userId })
  if (company) {
    response.companyDetails = {
      name: company.name,
      city: company.city,
      state: company.state,
      country: company.country,
      zip: company.zip,
      website: company.website,
      abn: company.abn,
      address: company.address,
    }
  }
  if (shipping) {
    response.shippingDetails = {
      sampleAddress: shipping.sampleAddress,
      warehouseAddress: shipping.warehouseAddress,
      sampleData: shipping.sampleData,
      wareHouseData: shipping.wareHouseData,
    }
  }

  res
    .header('Authorization', token)
    .send({ statusCode: 200, message: 'Success', data: response })
})

// Forgot Password Request
router.post('/forgotPassword', async (req, res) => {
  const { error } = forgotPassword(req.body)
  if (error)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: error.details[0].message,
    })

  let email = req.body.email.toLowerCase()
  // verify if user exists
  let user = await User.findOne({ email: email })
  if (!user)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_EMAIL,
    })

  var otp = await Otp.findOne({ email: req.body.email })
  if (otp) {
    await Otp.deleteOne({ _id: otp._id })
  }

  otp = new Otp({
    email: user.email,
    type: 'FP',
    otpExpiry:
      Date.now() + config.get('reset_password_otp_expiry_in_mins') * 60 * 1000,
  })
  otp.otp = otp.generateOtp()
  await otp.save()

  // SEND EMAIL
  const result = await sendResetPasswordMail(
    user.email,
    user.fullName,
    `/resetPassword/${user.email}/${otp.otp}`
  )
  if (result.code) {
    return res.status(500).send({
      message: 'Failure',
      statusCode: 500,
      data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE,
    })
  }

  return res.send({
    statusCode: 200,
    message: 'Success',
    data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_SUCCESS,
  })
})

router.post('/admin/forgotPassword', async (req, res) => {
  const { error } = forgotPassword(req.body)
  if (error)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: error.details[0].message,
    })

  let email = req.body.email.toLowerCase()
  // verify if user exists
  let admin = await User.findOne({ email: email, role: 'admin' })
  if (!admin)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_EMAIL,
    })

  var otp = await Otp.findOne({ email: req.body.email })
  if (otp) {
    await Otp.deleteOne({ _id: otp._id })
  }

  otp = new Otp({
    email: admin.email,
    type: 'FP',
    otpExpiry:
      Date.now() + config.get('reset_password_otp_expiry_in_mins') * 60 * 1000,
  })
  otp.otp = otp.generateOtp()
  await otp.save()

  // SEND EMAIL
  const result = await adminResetPasswordMail(
    admin.email,
    'ADMIN',
    `/resetPassword/${admin.email}/${otp.otp}`
  )
  if (result.code) {
    return res.status(500).send({
      message: 'Failure',
      statusCode: 500,
      data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE,
    })
  }

  return res.send({
    statusCode: 200,
    message: 'Success',
    data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_SUCCESS,
  })
})

//change password
router.post('/password/change/', userAuth, async (req, res) => {
  const { error } = validateChangePassword(req.body)
  if (error)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: error.details[0].message,
    })

  let user = await User.findById(req.jwtData.userId)
  if (!user)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_USER,
    })

  const validPassword = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  )
  if (!validPassword)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_PASSWORD,
    })

  let encryptPassword = await bcrypt.hash(
    req.body.newPassword,
    config.get('bcryptSalt')
  )

  user.password = encryptPassword
  await user.save()
  res.send({
    statusCode: 200,
    message: 'Success',
    data: AUTH_CONSTANTS.PASSWORD_CHANGE_SUCCESS,
  })
})

// Reset password
router.post('/resetPassword', async (req, res) => {
  const { error } = validateResetMobilePassword(req.body)
  if (error)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: error.details[0].message,
    })

  let user = await User.findOne({ email: req.body.email })
  if (!user)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_MOBILE,
    })

  let isValid = await verifyAndDeleteToken(req.body.email, req.body.code, 'FP')
  if (!isValid)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_OTP,
    })

  var encryptPassword = await bcrypt.hash(
    req.body.password,
    config.get('bcryptSalt')
  )
  user.password = encryptPassword

  await User.updateOne({ _id: user._id }, { $set: { password: user.password } })
  res.send({
    statusCode: 200,
    message: 'Success',
    data: AUTH_CONSTANTS.PASSWORD_CHANGE_SUCCESS,
  })
})

router.post('/admin/resetPassword', async (req, res) => {
  const { error } = validateResetMobilePassword(req.body)
  if (error)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: error.details[0].message,
    })

  let admin = await User.findOne({ email: req.body.email, role: 'admin' })
  if (!admin)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_MOBILE,
    })

  let isValid = await verifyAndDeleteToken(req.body.email, req.body.code, 'FP')
  if (!isValid)
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data: AUTH_CONSTANTS.INVALID_OTP,
    })

  var encryptPassword = await bcrypt.hash(
    req.body.password,
    config.get('bcryptSalt')
  )
  admin.password = encryptPassword

  await User.updateOne(
    { _id: admin._id },
    { $set: { password: admin.password } }
  )
  res.send({
    statusCode: 200,
    message: 'Success',
    data: AUTH_CONSTANTS.PASSWORD_CHANGE_SUCCESS,
  })
})

function validateLogin(req) {
  const schema = Joi.object()
    .keys({
      email: Joi.string().min(5).max(255),
      mobile: Joi.string().min(1).max(255),
      password: Joi.string().min(5).max(255).required(),
      version: Joi.string(),
      deviceToken: Joi.string(),
    })
    .xor('email', 'mobile')

  return Joi.validate(req, schema)
}

function forgotPassword(req) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    mobile: Joi.string(),
  }
  return Joi.validate(req, schema)
}

function validateChangePassword(req) {
  const schema = {
    oldPassword: Joi.string().min(5).max(255).required(),
    newPassword: Joi.string().min(5).max(255).required(),
  }
  return Joi.validate(req, schema)
}

module.exports = router
