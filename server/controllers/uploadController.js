const asyncHandler = require('express-async-handler');
const cloudinary = require('../utils/cloudinary');

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  try {
    cloudinary.uploader.upload_stream(
      { folder: "cse_society" },
      (error, result) => {
        if (error || !result) {
          res.status(500);
          return res.json({ message: 'Image could not be uploaded', error });
        }
        res.status(200).json({
          message: 'Image uploaded successfully',
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    ).end(req.file.buffer);
  } catch (error) {
    res.status(500);
    throw new Error('Image could not be uploaded');
  }
});

module.exports = {
  uploadImage,
};
