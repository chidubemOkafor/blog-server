const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.CLOUD_API_KEY;
const api_secret = process.env.CLOUD_API_SECRET;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

module.exports = { cloudinary };
