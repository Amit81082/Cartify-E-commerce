const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
      },
    ],

    totalAmount: Number,

    paymentStatus: {
      type: String,
      default: "pending", // 👉 default
    },

    paymentId: String, // 👉 razorpay_payment_id
  },
  { timestamps: true },
);

module.exports = mongoose.model("order", orderSchema);
