import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const UpdateProduct = () => {
  const [plantData, setPlantData] = useState({
    product_name: "",
    description: "",
    price: "",
    product_image: "",
    availability: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlantData({ ...plantData, [name]: value });
  };

  const handleRadioChange = (e) => {
    setPlantData({ ...plantData, availability: e.target.value === "true" });
  };

  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;
  const navigate = useNavigate();

  const { productId } = useParams();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    const getSingleProductData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/${productId}`);

        if (response.status === 200) {
          setPlantData(response.data);
        }
      } catch (err) {
        console.log(`Error getting single product data: ${err}`);
      }
    };

    getSingleProductData();
  }, [token, navigate]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${BASE_URL}/products/update-product/${productId}`,
        plantData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/admin/dashboard");
        toast.success("Plant updated successfully");
      }
    } catch (err) {
      console.log(`Error while updating data: ${err}`);
    }
  };

  return (
    <div className="h-[90vh] flex flex-col items-center justify-center">
      <form
        onSubmit={handleUpdateProduct}
        className=" max-w-[600px] w-full p-4"
      >
        <div className="mb-[10px]">
          <input
            type="text"
            name="product_name"
            className="bg-[#bababa] mb-[15px] w-full p-3 rounded text-[#333] placeholder:text-black outline-none hover:outline-none"
            placeholder="Product name"
            value={plantData.product_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-[10px]">
          <input
            type="text"
            name="price"
            className="bg-[#bababa] mb-[15px] w-full p-3 rounded text-[#333] placeholder:text-black outline-none hover:outline-none"
            placeholder="Price"
            value={plantData.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-[10px]">
          <input
            type="url"
            name="product_image"
            className="bg-[#bababa] mb-[15px] w-full p-3 rounded text-[#333] placeholder:text-black outline-none hover:outline-none"
            placeholder="Product image URL"
            value={plantData.product_image}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-[20px] flex flex-col sm:flex-row gap-[20px] sm:gap-[100px] cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <input
              type="radio"
              name="availability"
              value={true}
              checked={plantData.availability === true}
              onChange={handleRadioChange}
            />{" "}
            <label htmlFor="">Available</label>
          </div>
          <div className="flex item-center gap-[10px]">
            <input
              type="radio"
              name="availability"
              value={false}
              checked={plantData.availability === false}
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
            value={plantData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 py-[5px] md:py-2 px-3 md:px-6 text-white text-[14px] md:text-[18px] font-[600] h-[44px] rounded-[10px] md:rounded-[50px]"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
