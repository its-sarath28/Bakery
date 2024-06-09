import { Route, Routes } from "react-router-dom";

import Home from "../pages/User/Home";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import Logout from "../pages/Auth/Logout";
import ProductDetail from "../pages/Product/ProductDetail";
import Cart from "../pages/User/Cart";
import Dashboard from "../pages/Admin/Dashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import CreateProduct from "../pages/Admin/CreateProduct";
import UpdateProduct from "../pages/Admin/UpdateProduct";
import MyOrders from "../pages/User/MyOrders";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/logout" element={<Logout />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
      <Route path="/users/cart" element={<Cart />} />
      <Route path="/orders/my-orders" element={<MyOrders />} />

      {/* Admin & Manager */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoutes allowedRoutes={["ROLE_ADMIN"]}>
            <Dashboard />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/admin/products/create-product"
        element={
          <ProtectedRoutes allowedRoutes={["ROLE_ADMIN"]}>
            <CreateProduct />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/admin/products/update-product/:productId"
        element={
          <ProtectedRoutes allowedRoutes={["ROLE_ADMIN"]}>
            <UpdateProduct />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
};

export default Routers;
