const mongoose = require('mongoose')
const Joi = require('joi')

const PaymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    payment_method: {
      type: String,
    },
    payment_amount: {
      type: Number,
    },
    user_device_details: {
      type: Object,
    },
    transction: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
)

const Payments = mongoose.model('Payment', PaymentSchema)

module.exports = Payments
