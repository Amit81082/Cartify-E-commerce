const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // 👉 ENV USED
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// 👉 CREATE ORDER API
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // 👉 FROM FRONTEND

    const options = {
      amount: amount * 100, // 👉 IMPORTANT (paise)
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      order, // 👉 SEND FULL ORDER
    });
  } catch (error) {
    console.log("create order error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 👉 VERIFY PAYMENT
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 👉 CREATE SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY) // 👉 SECRET KEY
      .update(body.toString())
      .digest("hex");

    // 👉 MATCH
    if (expectedSignature === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment Verified ✅",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment Failed ❌",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
