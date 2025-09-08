import { useEffect, useState } from "react";
import { loginUserAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../../store/Export";
import { faLandmarkFlag } from "@fortawesome/free-solid-svg-icons";

const LoginForm = ({ setFormType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(action.loginUserRedux(email, password));
    } catch (error) {
      toast.error("Error");
    }
  };
  useEffect(() => {
    if (user?.isauthentic === true) {
      toast.success(`Welcome ${user.account.name} to home`);
      navigate("/home");
    }
  }, [user]);
  const apiGoogle = import.meta.env.VITE_URL_GOOGLE;

  const handleLoginGoogle = async () => {
    window.location.href = apiGoogle;
  };
  return (
    <>
      <form
        onSubmit={handleLogin}
        className="w-[max(30vw,400px)] bg-white rounded pt-2 pb-4"
      >
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="h-full font-semibold text-2xl">LOGIN ACCOUNT</div>
        </div>
        <hr />
        <div className="flex flex-col gap-4 mt-5 px-4 mb-2">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-envelope w-2"></i>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400 py-2 px-2 focus:outline-hidden"
              type="email"
              id="email"
              placeholder="Enter your email ... "
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-lock w-2"></i>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-400 py-2 px-2 focus:outline-hidden"
              type="password"
              id="password"
              placeholder="Enter your password ... "
              required
            />
          </div>
          <div className="flex justify-end text-[14px]">
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-gray-700  hover:text-black hover:underline cursor-pointer "
            >
              Forgot password?
            </p>
          </div>
        </div>
        <div className="w-full flex justify-center mb-4 text-[20px]">
          <button className="w-[250px] py-2 bg-amber-100 rounded font-semibold">
            Login
          </button>
        </div>
        <div className="flex items-center w-full justify-center">
          <div className="h-[1px] bg-[rgba(85,85,85,0.52)] w-[70px]"></div>
          <div className="text-[rgba(31,30,30,0.64)] px-4">OR</div>
          <div className="h-[1px] bg-[rgba(85,85,85,0.52)] w-[70px]"></div>
        </div>
        <div className="flex justify-center mt-3">
          <button className=" w-[50px] h-[50px] " onClick={handleLoginGoogle}>
            <i className="fa-brands fa-google text-[40px] rounded-full border-[rgba(85,85,85,0.52)] border-1 py-1 px-1"></i>
          </button>
        </div>
        <div className="flex w-full justify-center mt-3">
          Don't have an account?
          <button
            type="button"
            onClick={() => setFormType("register")}
            className="text-blue-500 underline mx-1"
          >
            Register
          </button>
        </div>
      </form>
      <div className="flex justify-center mt-3">
        <button className=" w-[50px] h-[50px] " onClick={handleLoginGoogle}>
          <i className="fa-brands fa-google text-[40px] rounded-full border-[rgba(85,85,85,0.52)] border-1 py-1 px-1"></i>
        </button>
      </div>
    </>
  );
};

export default LoginForm;
