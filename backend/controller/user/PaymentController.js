const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../../models/order.model");


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // 👉 ENV USED
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// 👉 CREATE ORDER API
const createOrder = async (req, res) => {
  console.log("userId is ", req.userId);
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
  const { products, totalAmount } = req.body;
  // console.log("products", products , "totalAmount", totalAmount);
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
     // 👉 SAVE ORDER (MINIMAL)
     const newOrder = new Order({
       userId: req.userId, // 👉 assuming auth
       products: products.map((item) => ({
         productId: item.productId._id,
         quantity: item.quantity,
       })),
       totalAmount: totalAmount, // 👉 TEMP (improve later)
       paymentStatus: "paid",
       paymentId: razorpay_payment_id,
     });

     await newOrder.save(); // 👉 SAVE

     console.log(" Your newOrder is: ", newOrder);

     return res.json({
      data : newOrder,
       success: true,
       message: "Payment Verified & Order Saved ✅",
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
