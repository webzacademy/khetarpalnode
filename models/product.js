const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  volume: {type:Number},
  heroImage: {type:String},
  manufacturingPlace: String,
  pricing: [
    {
      units: Number,
      pricePerUnit: Number,
      rrp: Number,
      margin: Number,
      productionTime: Number,
    },
  ],
  labelPackaging: [
    {
      type: { type: String },
      material: { type: String },
      dimensions: { type: String },
      inProduction: { type: Number }, //in days
      image: { type: String },
      documents: [
        {
          document: { type: String },
          updatedAt: {
            type: Number,
            default: () => {
              return Math.round(new Date() / 1000);
            },
          },
        },
      ],
    },
  ],
  primaryPackaging: [
    {
      bottleName: String,
      bottleSize: String,
      bottleColor: String,
      closureName: String,
      closureColor: String,
      closureNeckSize: String,
      artworkImage: String,
      closureImage: String,
      productionTime: Number, //in days
      closureProductionTime: Number, //in days,
      documents: [
        {
          document: String,
          updatedAt: {
            type: Number,
            default: () => {
              return Math.round(new Date() / 1000);
            },
          },
        },
      ],
    },
  ],
  secondaryPackaging: [
    {
      boxType: String,
      boxMaterial: String,
      boxSize: String,
      shippingType: String,
      shippingMaterial: String,
      shippingSize: Number,
      cartonArtworkImage: String,
      cartonShippingImage: String,
      productionTime: Number, //in days
      documents: [
        {
          document: String,
          updatedAt: {
            type: Number,
            default: () => {
              return Math.round(new Date() / 1000);
            },
          },
        },
      ],
    },
  ],
  formulationPackaging: [
    {
      ingredientsList: String,
      productionTime: Number, //in days
      documents: [
        {
          document: String,
          updatedAt: {
            type: Number,
            default: () => {
              return Math.round(new Date() / 1000);
            },
          },
        },
      ],
    },
  ],
  carbonOffset: Number,
  primaryManufacturerId: { type: Array, default: [] },
  secondaryManufacturerId: { type: Array, default: [] },
  formulationManufacturerId: { type: Array, default: [] },
  labelManufacturerId: { type: Array, default: [] },
  closureManufacturerId: { type: Array, default: [] },

  compliance: [Object],
  amount: Number,
  closureDesc: String,
  lastProduction: String, //date
  productionTime: { type: Number, default: 0 },
  totalCount: Number,
  totalSold: Number,
  totalRating: Number,
  avgRating: Number,
  totalComplaints: Number,
  nameRegex: String,
  status: { type: String, enum: ["active", "inactive", "deleted"] },
  creationDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  insertDate: {
    type: Number,
    default: () => {
      return Math.round(new Date() / 1000);
    },
  },
});

productSchema.index({ userId: 1, nameRegex: 1 }, { unique: true });
productSchema.index({
  insertDate: 1,
});
const Product = mongoose.model("Product", productSchema);

function validateProductPost(user) {
  var pricingObject = Joi.object({
    units: Joi.number().strict(),
    pricePerUnit: Joi.number().strict(),
    rrp: Joi.number().strict().required(),
    margin: Joi.number().strict().required(),
    productionTime: Joi.number().strict(),
  });

  var primaryObject = Joi.object({
    bottleName: Joi.string(),
    bottleSize: Joi.string(),
    bottleColor: Joi.string(),
    closureName: Joi.string(),
    closureColor: Joi.string(),
    closureNeckSize: Joi.string(),
    artworkImage: Joi.string(),
    closureImage: Joi.string(),
    productionTime: Joi.number().strict(),
    closureProductionTime: Joi.number().strict(),
    documents: Joi.array(),
  });

  var secondaryObject = Joi.object({
    boxType: Joi.string(),
    boxMaterial: Joi.string(),
    boxSize: Joi.string(),
    shippingType: Joi.string(),
    shippingMaterial: Joi.string(),
    shippingSize: Joi.number().strict(),
    cartonArtworkImage: Joi.string(),
    cartonShippingImage: Joi.string(),
    productionTime: Joi.number().strict(),
    documents: Joi.array(),
  });

  var formulationObject = Joi.object({
    ingredientsList: Joi.string(),
    productionTime: Joi.number().strict(),
    documents: Joi.array(),
  });

  var labelObject = Joi.object({
    type: Joi.string(),
    material: Joi.string(),
    dimensions: Joi.string(),
    documents: Joi.array(),
    image: Joi.string(),
    inProduction: Joi.number().strict(),
  });
  const schema = {
    userId: Joi.string().min(24).max(24).required(),
    name: Joi.string().required(),
    volume: Joi.number().strict().required(),
    heroImage: Joi.string().allow("").required(),
    manufacturingPlace: Joi.string(),
    pricing: Joi.array().items(pricingObject),
    productionTime: Joi.number().strict(),
    primaryPackaging: Joi.array().items(primaryObject),
    secondaryPackaging: Joi.array().items(secondaryObject),
    formulationPackaging: Joi.array().items(formulationObject),
    labelPackaging: Joi.array().items(labelObject),

    carbonOffset: Joi.number().strict(),
    primaryManufacturerId: Joi.array(),
    secondaryManufacturerId: Joi.array(),
    formulationManufacturerId: Joi.array(),
    labelManufacturerId: Joi.array(),
    closureManufacturerId: Joi.array(),

    primary: {
      name: Joi.string(),
      address: Joi.string(),
      contactName: Joi.string(),
      contactEmail: Joi.string(),
      phone: Joi.string(),
      weChatId: Joi.string(),
      country: Joi.string(),
      finalVersion: Joi.string(),
    },
    secondary: {
      name: Joi.string(),
      address: Joi.string(),
      contactName: Joi.string(),
      contactEmail: Joi.string(),
      phone: Joi.string(),
      weChatId: Joi.string(),
      country: Joi.string(),
      finalVersion: Joi.string(),
    },
    formulation: {
      name: Joi.string(),
      address: Joi.string(),
      contactName: Joi.string(),
      contactEmail: Joi.string(),
      phone: Joi.string(),
      weChatId: Joi.string(),
      country: Joi.string(),
      finalVersion: Joi.string(),
    },
    label: {
      name: Joi.string(),
      address: Joi.string(),
      contactName: Joi.string(),
      contactEmail: Joi.string(),
      phone: Joi.string(),
      weChatId: Joi.string(),
      country: Joi.string(),
      finalVersion: Joi.string(),
    },
    closure: {
      name: Joi.string(),
      address: Joi.string(),
      contactName: Joi.string(),
      contactEmail: Joi.string(),
      phone: Joi.string(),
      weChatId: Joi.string(),
      country: Joi.string(),
      finalVersion: Joi.string(),
    },
  };
  return Joi.validate(user, schema);
}

function validateProductPut(user) {
  var pricingObject = Joi.object({
    units: Joi.number().strict(),
    pricePerUnit: Joi.number().strict(),
    rrp: Joi.number().strict().required(),
    margin: Joi.number().strict().required(),
    productionTime: Joi.number().strict(),
  });

  var primaryObject = Joi.object({
    bottleName: Joi.string(),
    bottleSize: Joi.string(),
    bottleColor: Joi.string(),
    closureName: Joi.string(),
    closureColor: Joi.string(),
    closureNeckSize: Joi.string(),
    artworkImage: Joi.string(),
    closureImage: Joi.string(),
    productionTime: Joi.number().strict(),
    closureProductionTime: Joi.number().strict(),
    documents: Joi.array(),
  });

  var secondaryObject = Joi.object({
    boxType: Joi.string(),
    boxMaterial: Joi.string(),
    boxSize: Joi.string(),
    shippingType: Joi.string(),
    shippingMaterial: Joi.string(),
    shippingSize: Joi.number().strict(),
    cartonArtworkImage: Joi.string(),
    cartonShippingImage: Joi.string(),
    productionTime: Joi.number().strict(),
    documents: Joi.array(),
  });

  var formulationObject = Joi.object({
    ingredientsList: Joi.string(),
    productionTime: Joi.number().strict(),
    documents: Joi.array(),
  });

  var labelObject = Joi.object({
    type: Joi.string(),
    material: Joi.string(),
    dimensions: Joi.string(),
    documents: Joi.array(),
    image: Joi.string(),
    inProduction: Joi.number().strict(),
  });
  const schema = {
    productId: Joi.string().required(),
    name: Joi.string(),
    volume: Joi.number().strict(),
    heroImage: Joi.string(),
    manufacturingPlace: Joi.string(),
    pricing: Joi.array().items(pricingObject),

    primaryPackaging: Joi.array().items(primaryObject),
    secondaryPackaging: Joi.array().items(secondaryObject),
    formulationPackaging: Joi.array().items(formulationObject),
    labelPackaging: Joi.array().items(labelObject),

    carbonOffset: Joi.number().strict(),
    primaryManufacturerId: Joi.array(),
    secondaryManufacturerId: Joi.array(),
    formulationManufacturerId: Joi.array(),
    labelManufacturerId: Joi.array(),
    closureManufacturerId: Joi.array(),

    compliance: Joi.array(),
    status: Joi.string().valid(["active", "inactive", "blocked", "suspended"]),
    type: Joi.array(),
    productionTime: Joi.number().strict(),
  };
  return Joi.validate(user, schema);
}

module.exports.Product = Product;
module.exports.validateProductPost = validateProductPost;
module.exports.validateProductPut = validateProductPut;
