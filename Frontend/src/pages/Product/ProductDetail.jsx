import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const ProductDetail = () => {
  const [plantData, setPlantData] = useState({
    product_name: "",
    description: "",
    price: "",
    product_image: "",
    availability: null,
  });

  const [quantity, setQuantity] = useState(1);

  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;

  const navigate = useNavigate();

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const { productId } = useParams();

  useEffect(() => {
    const getPlantDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/${productId}`);

        if (response.status === 200) {
          setPlantData(response.data);
        }
      } catch (err) {
        console.log(`Error getting single plant details: ${err}`);
      }
    };

    getPlantDetail();
  }, []);

  const addToCart = async () => {
    try {
      if (!token) {
        navigate("/auth/sign-in");
      }

      const response = await axios.post(`${BASE_URL}/cart/add-product`, null, {
        params: {
          productId: productId,
          quantity: quantity,
        },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success("Product added to cart successfully");
      }
    } catch (err) {
      toast.error("Error: adding product to cart");
      console.error("Failed to add product to cart", err);
    }
  };

  return (
    <div className=" max-w-[1450px] mx-auto px-[20px] py-[30px]">
      <div className="grid md:grid-cols-3 gap-[20px]">
        <div>
          <figure className=" w-full h-[35rem]">
            <img
              src={plantData.product_image}
              alt={plantData.product_name}
              className="w-full h-full object-cover rounded-md"
            />
          </figure>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-[600] text-[28px] mt-[30px]">
            {plantData.product_name}
          </h3>

          <p className=" text-gray-500 my-[10px]">{plantData.description}</p>

          <p>
            Price: <span className="font-[600]">{plantData.price}</span>
          </p>

          <div className="mt-[20px] flex items-center gap-[20px]">
            <div className=" h-[2rem]">
              <button
                className="bg-gray-300 text-black px-2 py-1 rounded-l-md"
                onClick={decrementQuantity}
              >
                -
              </button>

              <input
                type="number"
                name="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="bg-gray-100 w-[3rem] h-full text-center border-t border-b outline-none hover:outline-none"
                min={1}
                max={10}
              />

              <button
                className="bg-gray-300 text-black px-2 py-1 rounded-r-md"
                onClick={incrementQuantity}
              >
                +
              </button>
            </div>

            <button
              onClick={addToCart}
              className=" bg-green-600 text-white py-2 px-3 rounded-md"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
