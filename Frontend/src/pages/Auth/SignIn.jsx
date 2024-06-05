import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const SignIn = () => {
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const { setIsLoggedIn, setRole } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log(authData);

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/admin/sign-in`,
        authData
      );

      if (response.status === 200) {
        const { token, role } = response.data;
        setIsLoggedIn(token);
        setRole(role);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-[#333] text-[#eee] mb-[15px]"
            value={authData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="password"
            className="bg-[#333] text-[#eee] mb-[15px]"
            value={authData.password}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit" className="bg-[#333]">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
