const config = require("config");
const winston = require("winston");
const sgMail = require("@sendgrid/mail");
const mongoose = require("mongoose");
const {
  resetPassword,
  adminResetPassword,
  SendMail,
  newProductEmail,
  shippedProductEmail,
  acceptedProductEmail,
  delayEmail,
  orderPlaced,
  userMail,
  trackMail,
  orderSubmitted,
} = require("../services/htmlTemplateFile");
const formatter = require("../services/commonFunctions");
sgMail.setApiKey(config.get("email_sendgrid.email_api_key"));

//for forgot password
async function sendResetPasswordMail(email, username, ActivationLink) {
  let data = {
    name: username,
    email: email,
    link: ActivationLink,
  };
  // console.log("aa", data);
  const temp = formatter(resetPassword, data);
  const msg = {
    to: email,
    from: config.get("email_sendgrid.senderId"),
    subject: config.get("email_sendgrid.OtpSubject"),
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    winston.error(`Sending of Email failed for ${email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function adminResetPasswordMail(email, username, ActivationLink) {
  let data = {
    name: username,
    email: email,
    link: ActivationLink,
  };
  // console.log("aa", data);
  const temp = formatter(adminResetPassword, data);
  const msg = {
    to: email,
    from: config.get("email_sendgrid.senderId"),
    subject: config.get("email_sendgrid.OtpSubject"),
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    winston.error(`Sending of Email failed for ${email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function sendMail(email, username, orderId) {
  let data = {
    name: username,
    orderId: orderId,
  };
  let text = "hi $name$ , Your order $orderId$ has been accepted by amdin";
  const temp = formatter(text, data);
  const msg = {
    to: email,
    from: config.get("email_sendgrid.senderId"),
    subject: config.get("email_sendgrid.OrderSubject"),
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    winston.error(`Sending of Email failed for ${email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function sendGeneralMail(emailData) {
  // console.log(emailData);
  let data = {
    email: "khetarpal123@gmail.com",
    name: emailData ? emailData.subject : "",
    text: emailData ? emailData.message : "",
  };
  // console.log(data);
  const temp = formatter(data.text, data);
  const msg = {
    to: data.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${data.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    console.log(Ex);
    winston.error(`Sending of Email failed for ${data.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function sendUserMail(user, password) {
  let data = {
    email: user.email,
    password: password,
    userName: user.email,
  };

  const temp = formatter(userMail, data);
  const msg = {
    to: data.email,
    from: config.get("email_sendgrid.senderId"),
    subject: "Registered user",
    html: temp,
  };

  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${data.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    winston.error(`Sending of Email failed for ${data.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function sendAllMail(emailData) {
  let data = {
    email: emailData ? emailData.email : "",
    name: emailData ? emailData.name : "",
    text: emailData ? emailData.text : "",
  };
  const temp = formatter(SendMail, data);
  const msg = {
    to: data.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${data.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    console.log(Ex);
    winston.error(`Sending of Email failed for ${data.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function sendProductMail(emailData) {
  let data = {};
  const temp = formatter(newProductEmail, data);
  const msg = {
    to: emailData.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${emailData.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    winston.error(`Sending of Email failed for ${emailData.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function sendProductShippedMail(emailData) {
  let data = {
    productName: emailData.productName,
    amountLeft: emailData.amountLeft,
    link: "/oderDetails",
  };
  const temp = formatter(shippedProductEmail, data);
  const msg = {
    to: emailData.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${emailData.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    winston.error(`Sending of Email failed for ${emailData.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function sendAcceptedMail(emailData) {
  let data = {
    name: emailData.username,
    productName: emailData.productName,
  };
  const temp = formatter(acceptedProductEmail, data);
  const msg = {
    to: emailData.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${emailData.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    console.log(Ex);
    winston.error(`Sending of Email failed for ${emailData.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function sendDelayMail(emailData) {
  let data = {
    name: emailData.username,
    productName: emailData.productName,
  };
  const temp = formatter(acceptedProductEmail, data);
  const msg = {
    to: emailData.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${emailData.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    console.log(Ex);
    winston.error(`Sending of Email failed for ${emailData.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function sendDelayMail(emailData) {
  let data = {
    userName: emailData.userName,
    productName: emailData.productName,
    component: emailData.component,
    reason: emailData.reason,
  };
  const temp = formatter(delayEmail, data);
  const msg = {
    to: emailData.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${emailData.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    console.log(Ex);
    winston.error(`Sending of Email failed for ${emailData.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function orderPlacedMail(emailData) {
  let data = {
    userName: emailData.userName,
    productName: emailData.productName,
    cost: emailData.cost,
    units: emailData.units,
    RRP: emailData.RRP,
    margin: emailData.margin,
    orderId: emailData.orderId,
    heroImage: emailData.heroImage,
  };
  console.log(emailData);
  const temp = formatter(orderPlaced, data);
  const msg = {
    to: emailData.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${emailData.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    console.log(Ex);
    winston.error(`Sending of Email failed for ${emailData.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

async function orderSubmittedMail(emailData) {
  let data = {
    userName: emailData.userName,
    productName: emailData.productName,
    cost: emailData.cost,
    units: emailData.units,
    RRP: emailData.RRP,
    margin: emailData.margin,
    orderId: emailData.orderId,
    heroImage: emailData.heroImage,
    quantity: emailData.quantity,
    primaryProductionTime: emailData.primaryProductionTime,
    secondaryProductionTime: emailData.secondaryProductionTime,
    formulationProductionTime: emailData.formulationProductionTime,
    labelProductionTime: emailData.labelProductionTime,
    productionTime: emailData.productionTime,
    amount: emailData.amount,
    deliveredDate: emailData.deliveredDate,
    totalAmount: emailData.totalAmount,
    donationAmount: emailData.donationAmount,
    shippingAddress: emailData.shippingAddress,
  };
  const temp = formatter(orderSubmitted, data);
  const msg = {
    to: emailData.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${emailData.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    console.log(Ex);
    winston.error(`Sending of Email failed for ${emailData.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}
async function trackingMail(emailData) {
  let data = {
    userName: emailData.userName,
    productName: emailData.productName,
    component: emailData.component,
  };
  const temp = formatter(trackMail, data);
  const msg = {
    to: emailData.email,
    from: config.get("email_sendgrid.senderId"),
    subject: emailData.subject,
    html: temp,
  };
  try {
    const result = await sgMail.send(msg);
    winston.info(`Sending of Email to ${emailData.email} success with status code: ${result[0].statusCode}: ${result[0].statusMessage}.`);
    return {
      statusCode: result[0].statusCode,
      message: result[0].statusMessage,
    };
  } catch (Ex) {
    console.log(Ex);
    winston.error(`Sending of Email failed for ${emailData.email} with errorcode: ${Ex.code}: ${Ex.message}.`);
    return { code: Ex.code, message: Ex.message };
  }
}

module.exports.sendResetPasswordMail = sendResetPasswordMail;
module.exports.sendMail = sendMail;
module.exports.sendGeneralMail = sendGeneralMail;
module.exports.sendUserMail = sendUserMail;
module.exports.sendAllMail = sendAllMail;
module.exports.sendProductMail = sendProductMail;
module.exports.sendAcceptedMail = sendAcceptedMail;
module.exports.adminResetPasswordMail = adminResetPasswordMail;
module.exports.sendDelayMail = sendDelayMail;
module.exports.orderPlacedMail = orderPlacedMail;
module.exports.trackingMail = trackingMail;
module.exports.orderSubmittedMail = orderSubmittedMail;
module.exports.sendProductShippedMail = sendProductShippedMail;
