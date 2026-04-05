import { toast } from "react-toastify";



 const handlePayment = async (totalPrice ) => {
  //  console.log("totalPrice", totalPrice);
   try {
     console.log("payment start"); // 👉 KEEP FOR DEBUG

     // 👉 CALL BACKEND
     const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/create-order`, {
       method: "POST",
       headers: {
         "content-type": "application/json",
       },
       body: JSON.stringify({
         amount: totalPrice, // 👉 YOUR TOTAL PRICE
       }),
     });

     const data = await response.json();

     if (!data.success) {
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
         amount: data.order.amount,
         currency: "INR",
         name: "Cartify",
         description: "Order Payment",
         order_id: data.order.id,

         handler: async function (response) {
           console.log("PAYMENT SUCCESS", response);

           try {
             // 👉 SEND TO BACKEND VERIFY API
             const verifyRes = await fetch(
               `${process.env.REACT_APP_BACKEND_DOMAIN}/api/verify-payment`,
               {
                 method: "POST",
                 headers: {
                   "content-type": "application/json",
                 },
                 body: JSON.stringify({
                   razorpay_order_id: response.razorpay_order_id,
                   razorpay_payment_id: response.razorpay_payment_id,
                   razorpay_signature: response.razorpay_signature,
                 }),
               },
             );

             const verifyData = await verifyRes.json();

             // 👉 HANDLE RESULT
             if (verifyData.success) {
               toast.success("Payment Successful ✅"); // 👉 SUCCESS UI
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

  export default handlePayment
