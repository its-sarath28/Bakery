import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-[20px]">
      <div>
        <Link to={"/"}>Logo</Link>
      </div>

      <div>
        <ul>
          <li>
            <Link to={"/users/cart"}>Cart</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
