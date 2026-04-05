import { toast } from "react-toastify";

const handlePayment = async ({
  data,
  totalPrice,
  setData,
  context,
  navigate,
}) => {
  console.log("totalPrice", totalPrice, "cartdata", data);
  try {
    console.log("payment start"); // 👉 KEEP FOR DEBUG

    // 👉 CALL BACKEND
    const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/create-order`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        amount: totalPrice, // 👉 YOUR TOTAL PRICE
      }),
    });

    const orderedData = await response.json();

    if (!orderedData.success) {
      toast.error("Order creation failed");
      return;
    }

    // 👉 LOAD RAZORPAY SCRIPT
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // 👉 OPEN RAZORPAY POPUP
      const options = {
        key: "rzp_test_SZhecWwajk3sKV", // 👉 PUT YOUR KEY HERE
        amount: orderedData.order.amount,
        currency: "INR",
        name: "Cartify",
        description: "Order Payment",
        order_id: orderedData.order.id,

        handler: async function (response) {
          console.log("PAYMENT SUCCESS", response);

          try {
            // 👉 SEND TO BACKEND VERIFY API
            const verifyRes = await fetch(
              `${process.env.REACT_APP_BACKEND_DOMAIN}/api/verify-payment`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  products: data, // 👉 cart items
                  totalAmount: totalPrice,
                }),
              },
            );

            const verifyData = await verifyRes.json();

            // 👉 HANDLE RESULT

            if (verifyData.success) {
              await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/clear-cart`, {
                method: "DELETE",
                credentials: "include",
              });
              setData([]); //  ADDED
              context.fetchCountAddtoCart(); //  ADDED
              navigate("/order"); //  ADDED
            } else {
              toast.error("Payment Failed ❌"); // 👉 FAIL UI
            }
          } catch (error) {
            console.log("payment verification error", error);
            toast.error("Verification Error ❌");
          }
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  } catch (error) {
    console.log(error);
  }
};

export default handlePayment;
