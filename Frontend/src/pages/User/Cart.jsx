import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cart`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCartItems(response.data.items);
          setTotalSum(response.data.totalSum);
          console.log(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch cart items", err);
      }
    };

    fetchCartItems();
  }, [token, totalSum]);

  const initiatePayment = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/order/checkout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(
        "Received Razorpay Order ID from backend:",
        data.razorpayOrderId
      );
      const options = {
        key: "",
        amount: data.totalAmount * 100,
        currency: "INR",
        name: "Backery",
        description: "Test Transaction",
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          console.log(
            "Received Razorpay Order ID in handler:",
            response.razorpay_order_id
          );
          try {
            const verifyResponse = await axios.post(
              `${BASE_URL}/order/verify-payment`,
              null,
              {
                params: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyResponse.status === 200) {
              alert("Payment successful!");
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Payment verification failed");
            console.error(error);
          }
        },
        // prefill: {
        //   name: "",
        //   email: "",
        //   contact: "",
        // },
        // notes: {
        //   address: "",
        // },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.product.id} className="cart-item">
            <h2>{item.product.product_name}</h2>
            <p>Description: {item.product.description}</p>
            <p>Price: {item.product.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>
              Type:{" "}
              {item.product.food_type === "VEG"
                ? "Vegetarian"
                : "Non Vegetarian"}
            </p>
            <p>{item.product.availability ? "Available" : "Not Available"}</p>
          </div>
        ))
      )}

      <h2>Total sum: {totalSum}</h2>
      <button onClick={initiatePayment}>Checkout</button>
    </div>
  );
};

export default Cart;
