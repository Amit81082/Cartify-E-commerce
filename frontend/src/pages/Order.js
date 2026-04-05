import { useEffect, useState } from "react";

export default function Order() {
  const [orders, setOrders] = useState([]); // 👉 STATE
  const [loading, setLoading] = useState(false);
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/get-orders`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      setLoading(false)

      if (data.success) {
        setOrders(data.data); //  SAVE
      }
    } catch (error) {
      console.log("error in fetching orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <h3 className="text-center text-slate-400 font-medium py-4 text-2xl">
        Your orders are loading, please wait...
      </h3>
    );

  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>

      {orders.length === 0 && <p>No Orders Found</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-2xl shadow-md p-5 border"
        >
          {/* 👉 HEADER */}
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <span className="bg-green-100 text-green-600 px-3 py-1 text-xs rounded-full">
              Paid
            </span>
          </div>

          {/* 👉 PRODUCTS LIST */}
          <div className="space-y-3">
            {order.products.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
              >
                {/* 👉 PRODUCT NAME */}
                <p className="text-gray-700 font-medium">
                  {item.productId?.productName}
                </p>

                {/* 👉 QTY */}
                <p className="text-sm text-gray-500">
                  Qty: <span className="font-semibold">{item.quantity}</span>
                </p>
              </div>
            ))}
          </div>

          {/* 👉 TOTAL SECTION */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t">
            <p className="text-lg font-semibold text-gray-700">Total</p>

            <p className="text-lg font-bold text-blue-600">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
