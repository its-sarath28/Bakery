import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    product_name: "",
    description: "",
    price: "",
    food_type: "VEG",
    availability: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSelectChange = (e) => {
    setProductData({ ...productData, food_type: e.target.value });
  };

  const handleRadioChange = (e) => {
    setProductData({ ...productData, availability: e.target.value === "true" });
  };

  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;
  const navigate = useNavigate();

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    console.log(productData);

    try {
      const response = await axios.post(
        `${BASE_URL}/products/create-products`,
        productData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/admin/dashboard");
        toast.success("Product created successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateProduct}>
        <div>
          <input
            type="text"
            name="product_name"
            className="bg-[#333] text-[#eee] mb-[15px]"
            placeholder="Product name"
            value={productData.product_name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            className="bg-[#333] text-[#eee] mb-[15px]"
            placeholder="Description"
            value={productData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="price"
            className="bg-[#333] text-[#eee] mb-[15px]"
            placeholder="Price"
            value={productData.price}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <select
            name="food_type"
            value={productData.food_type}
            onChange={handleSelectChange}
            className="bg-[#333] text-[#eee] mb-[15px]"
          >
            <option value="VEG">VEG</option>
            <option value="NON_VEG">NON_VEG</option>
            <option value="CONTAINS_EGG">CONTAINS_EGG</option>
          </select>
        </div>
        <div>
          <input
            type="radio"
            name="availability"
            value={true}
            checked={productData.availability === true}
            onChange={handleRadioChange}
          />{" "}
          <label htmlFor="">Available</label>
          <input
            type="radio"
            name="availability"
            value={false}
            checked={productData.availability === false}
            onChange={handleRadioChange}
          />{" "}
          <label htmlFor="">Not-available</label>
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
