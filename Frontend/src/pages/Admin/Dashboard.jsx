import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../../context/UserContext";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Dashboard = () => {
  const [plantData, setPlantData] = useState([]);

  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    const getPlantData = async () => {
      const response = await axios.get(`${BASE_URL}/products`);

      if (response.status === 200) {
        setPlantData(response.data);
        console.log(response);
      }
    };

    getPlantData();
  }, [token, navigate]);

  return (
    <div className="h-[90vh] max-w-[1400px] mx-auto pt-[50px] px-5">
      <div className=" mb-[30px] text-end">
        <Link
          to={"/admin/products/create-product"}
          className=" bg-green-500 text-white p-3 rounded-md border border-green-400 hover:bg-transparent hover:text-green-500"
        >
          Create product
        </Link>
      </div>
      <div className=" overflow-auto">
        <table className=" w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Product name</th>
              <th className="border border-gray-300 px-4 py-2">
                Product image
              </th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Availability</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {plantData.map((plant, index) => (
              <tr key={plant.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {plant.product_name}
                </td>
                <td className="border border-gray-300 px-4 py-2 ">
                  <figure className="flex items-center justify-center">
                    <img
                      src={plant.product_image}
                      alt={plant.plant_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </figure>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {plant.description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {plant.price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {plant.availability ? <p>Available</p> : <p>Out of stock</p>}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    to={`/admin/products/update-product/${plant.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Update
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
