import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import PlantLoader from "../../Components/PlantLoader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/products`);

        if (response.status === 200) {
          setProducts(response.data);
          console.log(response.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <>
      {isLoading && <PlantLoader />}

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-[30px] py-[50px]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
};

export default Products;
