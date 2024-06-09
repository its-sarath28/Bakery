import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../../context/UserContext";
import { formatDate } from "../../utils/formatDate";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/order`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setOrders(response.data);
          console.log(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div>
      <h1 className="text-center my-[30px] text-[26px] font-[600]">
        My Orders
      </h1>
      {orders?.length === 0 ? (
        <div className="h-[65vh] flex items-center justify-center">
          <p className="text-center">You don't have any orders!</p>
        </div>
      ) : (
        <div className="grid max-w-[1400px] mx-auto gap-[20px] px-[20px]">
          {/* <div className="md:col-span-3"> */}
          {orders?.map((order) => (
            <div key={order.id} className="mb-4">
              <h2 className="font-[600] text-[20px] mb-1">
                Order ID: {order.id}
              </h2>
              <p className="text-gray-500">
                Ordered on {formatDate(order.createdAt)}
              </p>
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start bg-[#e5e5e5] p-2 justify-between rounded-md border-b border-gray-400"
                >
                  <Link
                    to={`/products/${item.productId}`}
                    className="flex items-center mb-4 flex-grow"
                  >
                    <div className="max-w-[200px]">
                      <figure className="h-[8rem] w-[8rem] mr-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-contain rounded"
                        />
                      </figure>
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-[600] text-[22px]">
                        {item.productName}
                      </h3>
                      <p className="my-[5px] text-gray-500 line-clamp-3">
                        {item.productDescription}
                      </p>
                      <p className="mb-[10px]">Quantity: {item.quantity}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ))}
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
