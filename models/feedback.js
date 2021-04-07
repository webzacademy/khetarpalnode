const Joi = require("joi");
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: String,
  subject: String,
  message: String,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

function validatePost(feedback) {
  const schema = {
    subject: Joi.string().required(),
    message: Joi.string().required(),
  };
  return Joi.validate(feedback, schema);
}

function validateGet(feedback) {
  const schema = {
    subject: Joi.string(),
    message: Joi.string(),
  };
  return Joi.validate(feedback, schema);
}

exports.Feedback = Feedback;
exports.validatePost = validatePost;
exports.validateGet = validateGet;
