const { USER_CONSTANTS, COMPANY_CONSTANTS } = require('../config/constant.js')
const mongoose = require('mongoose')
const config = require('config')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const {
  User,
  validateUserPost,
  validateUserPut,
  validateUserListGet,
} = require('../models/user')
const { sendActivationMail } = require('../services/sendMail')
const { adminAuth, userAdminAuth } = require('../middleware/auth')
const { Shipping } = require('../models/shipping')
const { Company } = require('../models/company')
const { Card } = require('../models/card')
const { Cart } = require('../models/cart')
const { Production } = require('../models/production')
const { Country } = require('../models/country')
const multer = require('multer')
var storage = multer.memoryStorage()
var uploadDirect = multer({ storage: storage })
const FileUrl = 'https://ateli-yay.sfo2.digitaloceanspaces.com/'
const { sendUserMail } = require('../services/sendMail')
const { uploadDirectFileS3 } = require('../services/s3Upload')

mongoose.set('debug', true)

router.get('/userList', adminAuth, async (req, res) => {
  let criteria = {}

  var skipVal, limitVal
  if (isNaN(parseInt(req.query.offset))) skipVal = 0
  else skipVal = parseInt(req.query.offset)

  if (isNaN(parseInt(req.query.limit))) limitVal = 20
  else limitVal = parseInt(req.query.limit)

  if (req.query.userName) {
    var regexName = new RegExp(req.query.userName, 'i')
    criteria.userName = regexName
  }
  if (req.query.email) {
    criteria.email = req.query.email
  }

  if (req.query.status) criteria.status = req.query.status
  if (!req.query.status) {
    criteria.status = { $ne: 'deleted' }
  }
  if (req.query.mobile) {
    criteria.mobile = '+1' + req.query.mobile
  }
  if (req.query.startDate) {
    criteria.insertDate = { $gte: parseInt(req.query.startDate) }
  }
  if (req.query.endDate) {
    criteria.insertDate = { $lte: parseInt(req.query.endDate) }
  }
  if (req.query.startDate != null && req.query.endDate != null) {
    criteria.insertDate = {
      $gte: parseInt(req.query.startDate),
      $lte: parseInt(req.query.endDate),
    }
  }

  let userList = await User.aggregate([
    { $match: criteria },
    { $sort: { creationDate: -1 } },
    { $skip: skipVal },
    { $limit: limitVal },
    {
      $addFields: {
        userId: { $toString: '$_id' },
      },
    },
    {
      $lookup: {
        from: 'companies',
        let: { userId: '$userId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
          {
            $project: {
              userId: 1,
              name: 1,
              abn: 1,
              address: 1,
              city: 1,
              state: 1,
              country: 1,
              zip: 1,
              website: 1,
              companyId: '$_id',
              _id: 0,
            },
          },
        ],

        as: 'company',
      },
    },
    {
      $lookup: {
        from: 'shippings',
        let: { userId: '$userId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
          {
            $project: {
              userId: 1,
              sampleAddress: 1,
              warehouseAddress: 1,
              sampleData: 1,
              wareHouseData: 1,
              shippingId: '$_id',
              _id: 0,
            },
          },
        ],
        as: 'shippingData',
      },
    },
    {
      $project: {
        _id: 0,
        userId: 1,
        fullName: 1,
        email: 1,
        mobile: 1,
        status: 1,
        profilePic: 1,
        userType: 1,
        insertDate: 1,
        address: 1,
        city: 1,
        state: 1,
        country: 1,
        zip: 1,
        company: 1,
        shippingData: 1,
        totalAssignedProducts: 1,
      },
    },
  ])

  res
    .status(200)
    .send({ statusCode: 200, message: 'Success', data: { userList } })
})

// Create a new user  "/users/registerUser"
router.post('/', adminAuth, async (req, res) => {
  const { error } = validateUserPost(req.body)
  if (error)
    return res
      .status(400)
      .send({
        statusCode: 400,
        message: 'Failure',
        data: error.details[0].message,
      })
  // console.log(req.body);
  var email
  if (req.body.email) email = req.body.email.toLowerCase() || 'NA'
  var mobile = req.body.mobile || 'NA'
  var user = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] })

  if (user) {
    if (email === user.email)
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: USER_CONSTANTS.EMAIL_ALREADY_EXISTS,
        })
    if (req.body.mobile === user.mobile)
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: USER_CONSTANTS.MOBILE_ALREADY_EXISTS,
        })
  }

  user = new User(
    _.pick(req.body, [
      'role',
      'address',
      'profilePic',
      'city',
      'state',
      'zip',
      'country',
      'mobile',
    ])
  )

  user.email = req.body.email.toLowerCase()
  user.fullName = req.body.name

  // encrypt password
  if (req.body.password)
    user.password = await bcrypt.hash(
      req.body.password,
      config.get('bcryptSalt')
    )
  user.status = 'active'
  const token = user.generateAuthToken()
  user.accessToken = token

  let company = new Company({
    userId: user._id.toString(),
    name: req.body.companyName,
    city: req.body.companyCity,
    state: req.body.companyState,
    country: req.body.companyCountry,
    zip: req.body.companyZip,
    website: req.body.website,
    abn: req.body.abn,
    address: req.body.companyAddress,
    status: 'active',
  })

  let shipping = new Shipping({
    userId: user._id.toString(),
    sampleAddress: req.body.sampleAddress,
    warehouseAddress: req.body.warehouseAddress,
    sampleData: req.body.sampleData,
    wareHouseData: req.body.wareHouseData,
    status: 'active',
  })

  try {
    await user.save()
    await company.save()
    await shipping.save()
  } catch (Ex) {
    console.log(Ex)
    if (Ex.code === 11000)
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: COMPANY_CONSTANTS.DUPLICATE_COMPANY,
        })
    else
      return res
        .status(500)
        .send({
          statusCode: 500,
          message: 'Failure',
          data: COMPANY_CONSTANTS.SYSTEM_FAILURE,
        })
  }

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
    'city',
    'state',
    'zip',
    'country',
    'insertDate',
  ])

  response.isNewUser = false

  res
    .header('Authorization', token)
    .send({ statusCode: 200, message: 'Success', data: response })

  // SEND EMAIL
  const result = await sendUserMail(user, req.body.password)
  if (result.code) {
    return res
      .status(500)
      .send({
        message: 'Failure',
        statusCode: 500,
        data: AUTH_CONSTANTS.CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE,
      })
  }
})

// Update existing user
router.put('/', userAdminAuth, async (req, res) => {
  const { error } = validateUserPut(req.body)
  if (error)
    return res
      .status(400)
      .send({
        statusCode: 400,
        message: 'Failure',
        data: error.details[0].message,
      })

  let user
  if (req.jwtData.role === 'admin') {
    user = await User.findById(req.body.userId)
    if (!user)
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: USER_CONSTANTS.INVALID_USER,
        })
  } else {
    user = await User.findById(req.jwtData.userId)
    if (!user)
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: USER_CONSTANTS.INVALID_USER,
        })
  }

  user.fullName = req.body.name || user.fullName
  if (req.body.email && req.body.email != user.email) {
    tempUser = await User.findOne({ email: req.body.email })
    if (tempUser)
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: USER_CONSTANTS.EMAIL_ALREADY_EXISTS,
        })
    user.email = req.body.email
  }
  if (req.body.mobile && req.body.mobile != user.mobile) {
    tempUser = await User.findOne({ mobile: req.body.mobile })
    if (tempUser)
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: USER_CONSTANTS.MOBILE_ALREADY_EXISTS,
        })
    user.mobile = req.body.mobile
  }

  user.profilePic = req.body.profilePic || user.profilePic
  user.address = req.body.address || user.address
  user.city = req.body.city || user.city
  user.zip = req.body.zip || user.zip
  user.country = req.body.country || user.country
  user.state = req.body.state || user.state
  if (req.jwtData.role == 'admin') {
    user.status = req.body.status || user.status
    user.fullName = req.body.name || user.fullName
  }
  if (req.body.shippingData) {
    let shipping = await Shipping.findOne({ userId: user._id })
    let shippingData = req.body.shippingData
    if (shipping) {
      shipping.sampleAddress = shippingData.sampleAddress
      shipping.warehouseAddress = shippingData.warehouseAddress
      shipping.sampleData = shippingData.sampleData
      shipping.wareHouseData = shippingData.wareHouseData
      await shipping.save()
    }
  }

  if (req.body.companyData) {
    let companyData = req.body.companyData
    let company = await Company.findOne({ userId: user._id })
    if (company) {
      company.name = companyData.name
      company.city = companyData.city
      company.state = companyData.state
      company.country = companyData.country
      company.zip = companyData.zip
      company.website = companyData.website
      company.abn = companyData.abn
      await company.save()
    }
  }
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
    'city',
    'state',
    'zip',
    'country',
    'insertDate',
  ])
  res.status(200).send({ statusCode: 200, message: 'Success', data: response })
})

router.get('/', userAuth, async (req, res) => {
  let userDetails = await User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.jwtData.userId) } },
    {
      $addFields: {
        userId: { $toString: '$_id' },
      },
    },
    {
      $lookup: {
        from: 'companies',
        let: { userId: '$userId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
          {
            $project: {
              userId: 1,
              name: 1,
              abn: 1,
              address: 1,
              city: 1,
              state: 1,
              country: 1,
              zip: 1,
              website: 1,
              companyId: '$_id',
              _id: 0,
            },
          },
        ],

        as: 'company',
      },
    },
    {
      $lookup: {
        from: 'shippings',
        let: { userId: '$userId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
          {
            $project: {
              userId: 1,
              sampleAddress: 1,
              warehouseAddress: 1,
              sampleData: 1,
              wareHouseData: 1,
              shippingId: '$_id',
              _id: 0,
            },
          },
        ],
        as: 'shippingData',
      },
    },
    {
      $project: {
        _id: 0,
        userId: 1,
        fullName: 1,
        email: 1,
        mobile: 1,
        status: 1,
        profilePic: 1,
        userType: 1,
        insertDate: 1,
        address: 1,
        city: 1,
        state: 1,
        country: 1,
        zip: 1,
        company: 1,
        shippingData: 1,
        totalAssignedProducts: 1,
      },
    },
  ])

  return res.send({
    statusCode: 200,
    message: 'Success',
    data: { userDetails },
  })
})

// Fetch own profile based on auth token
router.get('/profile', userAdminAuth, async (req, res) => {
  let user = await User.findById(req.jwtData.userId)
  if (!user)
    return res
      .status(400)
      .send({
        statusCode: 400,
        message: 'Failure',
        data: USER_CONSTANTS.INVALID_USER,
      })

  let response = await User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.jwtData.userId) } },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        fullName: 1,
        email: 1,
        mobile: 1,
        status: 1,
        profilePic: 1,
        userType: 1,
        insertDate: 1,
        address: 1,
        city: 1,
        state: 1,
        country: 1,
        zip: 1,
        totalAssignedProducts: 1,
      },
    },
  ])
  res.send({ statusCode: 200, message: 'Success', data: response[0] })
})

router.get('/cartCount', userAdminAuth, async (req, res) => {
  let user
  if (req.jwtData.role == 'admin') {
    user = await User.findById(req.query.userId)
  } else {
    user = await User.findById(req.jwtData.userId)
  }
  return res.send({
    statusCode: 200,
    status: 'Success',
    data: {
      pendingOrderCount: user.totalProductsInCart,
      totalProductsInProduction: user.totalProductsInProduction,
      totalAssignedProducts: user.totalAssignedProducts,
    },
  })
})

//verify email or mobile
router.post('/verify', async (req, res) => {
  let criteria = {}
  let email
  if (req.body.email) {
    email = req.body.email.toLowerCase() || 'NMB'
    criteria.email = email
  }
  if (req.body.mobile) {
    criteria.mobile = req.body.mobile
  }
  if (req.body.email && req.body.mobile) {
    criteria = { $or: [{ email: email }, { mobile: req.body.mobile }] }
  }

  let user = await User.findOne(criteria)
  if (user) {
    if (email == user.email && req.body.mobile == user.mobile) {
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: USER_CONSTANTS.MOBILE_EMAIL_ALREADY_EXISTS,
        })
    }
    if (email === user.email)
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: USER_CONSTANTS.EMAIL_ALREADY_EXISTS,
        })

    if (req.body.mobile === user.mobile)
      return res
        .status(400)
        .send({
          statusCode: 400,
          message: 'Failure',
          data: USER_CONSTANTS.MOBILE_ALREADY_EXISTS,
        })
  }

  return res.send({
    statusCode: 200,
    message: 'Success',
    data: USER_CONSTANTS.VERIFICATION_SUCCESS,
  })
})

//Logout Api
router.put('/logout', userAuth, async (req, res) => {
  let result = await User.updateOne(
    { _id: req.jwtData.userId },
    { $unset: { accessToken: '', deviceToken: '' } }
  )
  if (result.n) {
    res
      .status(200)
      .send({
        statusCode: 200,
        status: 'Success',
        data: USER_CONSTANTS.LOGGED_OUT,
      })
  } else {
    return res
      .status(400)
      .send({
        statusCode: 400,
        status: 'Failure',
        data: USER_CONSTANTS.INVALID_USER,
      })
  }
})

//delete product
router.delete('/:userId', adminAuth, async (req, res) => {
  let inProduction = await Production.find({
    userId: req.params.userId,
    productStatus: { $ne: 'delivered' },
  })
  if (inProduction.length > 0) {
    return res.status(400).send({
      statusCode: 400,
      message: 'Failure',
      data:
        "There is one or more products of this user in production right now.You can't delete the user right now",
    })
  }
  let user = await User.findOne({ _id: req.params.userId })
  let results = await User.deleteOne({ _id: req.params.userId })

  if (results.deletedCount) {
    await Shipping.deleteOne({ userId: user._id })
    await Card.deleteOne({ userId: user._id })
    await Company.deleteOne({ userId: user._id })
    await Cart.deleteOne({ userId: user._id })
    await Production.deleteOne({ userId: user._id })
    return res.send({
      statusCode: 200,
      message: 'Success',
      data: 'User Deleted Successfully',
    })
  } else {
    return res
      .status(400)
      .send({ statusCode: 400, message: 'Failure', data: 'User Id not found' })
  }
})

//get countries
router.get('/countries', async (req, res) => {
  let criteria = {}
  var skipVal, limitVal
  if (isNaN(parseInt(req.query.offset))) skipVal = 0
  else skipVal = parseInt(req.query.offset)

  if (isNaN(parseInt(req.query.limit))) limitVal = 1000
  else limitVal = parseInt(req.query.limit)
  if (req.query.country) {
    var regexName = new RegExp('^' + req.query.country + '.*', 'i')
    criteria.Name = { $regex: regexName }
  }

  let countryList = await Country.aggregate([
    { $match: criteria },
    { $skip: skipVal },
    { $limit: limitVal },
    {
      $project: {
        _id: 0,
        country: '$Name',
      },
    },
  ])

  return res.send({
    statusCode: 200,
    status: 'Success',
    data: { countryList: countryList },
  })
})

module.exports = router
