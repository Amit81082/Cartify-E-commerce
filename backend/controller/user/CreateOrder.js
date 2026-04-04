const instance = require("../../config/Razorpayinstance");

const createOrder = async (req, res) => {
    try {
        const { amount, payment_capture } = req.body;
        const options = {
            amount: amount * 100,
            currency: 'INR',
          receipt: `order_${req.user._id}`,
            payment_capture: payment_capture ? true : false,
        };
        const response = await instance.orders.create(options);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = createOrder
