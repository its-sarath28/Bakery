import React from "react";
import Routers from "../../routers/Routers";
import Navbar from "../../Components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routers />
      </main>
    </>
  );
};

export default Layout;
