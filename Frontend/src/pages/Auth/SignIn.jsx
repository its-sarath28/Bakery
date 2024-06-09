import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PlusLoader from "../../Components/PlusLoader";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const SignIn = () => {
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const { setIsLoggedIn, setRole } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}/auth/admin/sign-in`,
        authData
      );

      if (response.status === 200) {
        const { token, role } = response.data;
        setIsLoggedIn(token);
        setRole(role);

        if (role === "ROLE_ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[90vh] flex flex-col items-center justify-center">
      <form
        onSubmit={handleSignIn}
        className="max-w-[500px] w-full p-6 rounded-md shadow-lg bg-[#fff] border border-gray-300"
      >
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-[#bababa] mb-[15px] w-full p-2 rounded text-[#333] placeholder:text-black outline-none hover:outline-none"
            value={authData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-[#bababa] mb-[15px] w-full p-2 rounded text-[#333] placeholder:text-black outline-none hover:outline-none"
            value={authData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#333] text-[#eee] w-full p-2 rounded max-w-[100px]"
          >
            {isLoading ? <PlusLoader size={10} color={"#eee"} /> : `Sign In`}
          </button>
        </div>
      </form>

      <p>
        Dont have an account?{" "}
        <Link
          to={"/auth/sign-up"}
          className="text-green-500 text-[16px] leading-7 font-[600] "
        >
          Create one
        </Link>
        .
      </p>
    </div>
  );
};

export default SignIn;
