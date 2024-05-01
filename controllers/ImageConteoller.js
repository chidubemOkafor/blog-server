const cloudinary = require("cloudinary").v2;

class ImageUPload {
  static async UploadImage(req, res) {
    try {
      const bufferString = req.file.buffer.toString("base64");
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${bufferString}`,
        {
          public_id: req.file.originalname,
        }
      );
      res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
}

module.exports = ImageUPload;
