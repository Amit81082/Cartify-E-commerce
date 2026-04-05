const orderModel = require("../../models/order.model");

// 👉 GET USER ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId })
      .populate("products.productId") // 👉 IMPORTANT
      .sort({ createdAt: -1 }); // 👉 LATEST FIRST

      console.log("All orders of user", orders);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

module.exports = {
  getOrders,
};
