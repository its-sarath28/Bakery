import React, { useContext, useState } from "react";
import axios from "axios";
import { MdAddShoppingCart } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;
  const navigate = useNavigate();

  const addToCart = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/cart/add-product`, null, {
        params: {
          productId: product.id,
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
    <div className="p-3 relative group">
      <div
        className="absolute top-[7%] right-[7%] bg-green-500 hover:bg-transparent border border-green-500 text-white hover:text-green-500 cursor-pointer text-[20px] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={addToCart}
      >
        <MdAddShoppingCart />
      </div>

      <figure className="w-full h-[20rem]">
        <img
          src={product.product_image}
          alt={product.product_name}
          className="h-full w-full object-cover rounded-md"
        />
      </figure>

      <h3 className="my-[10px] text-[22px] font-[600]">
        {product.product_name}
      </h3>

      <p className="text-gray-500 mb-[20px] line-clamp-3">
        {product.description}
      </p>

      <div className="flex justify-between items-center">
        <Link
          to={`/products/${product.id}`}
          className="bg-green-600 text-white py-1 px-2 rounded-md border border-green-600 hover:bg-transparent hover:text-green-600"
        >
          View
        </Link>

        <div className="flex items-center h-[2rem]">
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
      </div>
    </div>
  );
};

export default ProductCard;
