import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
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
        console.log("Product added to cart successfully");
      }
    } catch (err) {
      console.error("Failed to add product to cart", err);
    }
  };

  return (
    <div>
      <h1>{product.product_name}</h1>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      <p>
        Type: {product.food_type === "VEG" ? "Vegetarian" : "Non Vegetarian"}
      </p>
      <p>{product.availability ? "Available" : "Not Available"}</p>
      <input
        type="number"
        name="quantity"
        value={quantity}
        onChange={handleQuantityChange}
        placeholder="Quantity"
        min="1"
      />
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
};

export default ProductCard;
