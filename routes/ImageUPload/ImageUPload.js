const express = require("express");
const router = express.Router();
const ImageController = require("../../controllers/ImageConteoller");
const multer = require("multer");
const upload = multer();

router.post(
  "/imageUpload",
  upload.single("image"),
  ImageController.UploadImage
);

module.exports = router;
