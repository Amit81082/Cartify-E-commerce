const mongoose = require('mongoose')

const addToCart = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ FIX
      ref: "product",
    },
    quantity: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ FIX
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);


const addToCartModel = mongoose.model("addToCart",addToCart)

module.exports = addToCartModel
