// controller
const addToCartModel = require("../../models/cartProduct");

const clearCart = async (req, res) => {
  try {
    await addToCartModel.deleteMany({ userId: req.userId }); // 👉 DELETE ALL

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = clearCart;
