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
    product_image: "",
    availability: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
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
    <div className="h-[90vh] flex flex-col items-center justify-center">
      <form
        onSubmit={handleCreateProduct}
        className=" max-w-[600px] w-full p-4"
      >
        <div className="mb-[10px]">
          <input
            type="text"
            name="product_name"
            className="bg-[#bababa] mb-[15px] w-full p-3 rounded text-[#333] placeholder:text-black outline-none hover:outline-none"
            placeholder="Product name"
            value={productData.product_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-[10px]">
          <input
            type="text"
            name="price"
            className="bg-[#bababa] mb-[15px] w-full p-3 rounded text-[#333] placeholder:text-black outline-none hover:outline-none"
            placeholder="Price"
            value={productData.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-[10px]">
          <input
            type="url"
            name="product_image"
            className="bg-[#bababa] mb-[15px] w-full p-3 rounded text-[#333] placeholder:text-black outline-none hover:outline-none"
            placeholder="Product image URL"
            value={productData.product_image}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-[20px] flex flex-col sm:flex-row gap-[20px] sm:gap-[100px] cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <input
              type="radio"
              name="availability"
              value={true}
              checked={productData.availability === true}
              onChange={handleRadioChange}
            />{" "}
            <label htmlFor="">Available</label>
          </div>
          <div className="flex item-center gap-[10px]">
            <input
              type="radio"
              name="availability"
              value={false}
              checked={productData.availability === false}
              onChange={handleRadioChange}
            />{" "}
            <label htmlFor="">Out-of-Stock</label>
          </div>
        </div>

        <div className="mb-[10px]">
          <textarea
            name="description"
            className="bg-[#bababa] mb-[15px] w-full p-3 rounded text-[#333] placeholder:text-black outline-none hover:outline-none resize-y"
            placeholder="Description"
            rows={5}
            value={productData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 py-[5px] md:py-2 px-3 md:px-6 text-white text-[14px] md:text-[18px] font-[600] h-[44px] rounded-[10px] md:rounded-[50px]"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
