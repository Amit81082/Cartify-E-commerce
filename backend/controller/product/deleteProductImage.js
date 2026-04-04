const cloudinary = require("../../config/cloudinary");

const deleteProductImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    const response = await cloudinary.uploader.destroy(public_id);

    res.json({
      message: "Image deleted successfully",
      success: true,
      error: false,
      data: response,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = deleteProductImage;
