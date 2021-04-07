const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "zf5jqdyy43hkzk7b",
  publicKey: "bxf7jvphch8crs6d",
  privateKey: "5c95f595f3300ab55bd2d838976c4074",
});

module.exports = gateway;
