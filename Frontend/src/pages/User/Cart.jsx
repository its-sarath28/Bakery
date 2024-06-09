import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;
  const navigate = useNavigate();

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
        }
      } catch (err) {
        console.error("Failed to fetch cart items", err);
      }
    };

    fetchCartItems();
  }, [token]);

  const removeProduct = async (productId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/cart/remove-product`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          productId: productId,
        },
      });
      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.product.id !== productId)
        );
        setTotalSum((prevTotal) => {
          const productPrice = cartItems.find(
            (item) => item.product.id === productId
          ).product.price;
          return prevTotal - productPrice;
        });
        toast.success("Product removed successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

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
      const options = {
        // key: "",
        amount: data.totalAmount * 100,
        currency: "INR",
        name: "Planter",
        description: "Test Transaction",
        order_id: data.razorpayOrderId,
        handler: async (response) => {
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
              navigate("/");
              toast.success("Order placed successfully");
            } else {
              alert("Payment verification failed!");
              toast.error("Error while placing order");
            }
          } catch (error) {
            console.error("Payment verification failed");
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          address: "",
        },
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
      <h1 className="text-center my-[30px] text-[26px] font-[600]">
        Your Cart
      </h1>
      {cartItems.length === 0 ? (
        <div className="h-[65vh] flex items-center justify-center">
          <p className="text-center">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-[20px] px-[20px]">
          <div className="md:col-span-3">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start bg-[#e5e5e5] p-2 justify-between rounded-md border-b border-gray-400"
              >
                <Link
                  to={`/products/${item.product.id}`}
                  className="flex items-center mb-4 flex-grow"
                >
                  <div className="max-w-[200px]">
                    <figure className="h-[8rem] w-[8rem] mr-4">
                      <img
                        src={item.product.product_image}
                        alt={item.product.product_name}
                        className="w-full h-full object-contain rounded"
                      />
                    </figure>
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-[600] text-[22px]">
                      {item.product.product_name}
                    </h3>
                    <p className="my-[5px] text-gray-500 line-clamp-3">
                      {item.product.description}
                    </p>
                    <p className="mb-[10px]">Quantity: {item.quantity}</p>
                    <p className="font-[600]">₹{item.product.price}</p>
                  </div>
                </Link>

                <button
                  onClick={() => removeProduct(item.product.id)}
                  className="mt-[10px] bg-red-600 text-white px-3 py-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-center font-[600] text-[20px] mb-[20px]">
              Checkout
            </h3>

            <p className="font-[600] text-[18px]">
              Grand Total: <span>₹{totalSum}</span>
            </p>

            <button
              onClick={initiatePayment}
              className="bg-green-500 py-[5px] md:py-2 px-3 md:px-6 text-white text-[14px] md:text-[18px] font-[600] h-[44px] flex items-center justify-center rounded-[10px] w-full mt-[20px]"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
