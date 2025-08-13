import { useEffect, useState } from "react";
import { loginUserAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../../store/Export";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  console.log(user);
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
      toast.success(`Welcome ${user.account.email} to home`);
      navigate("/");
    }
  }, [user]);
  return (
    <form
      onSubmit={handleLogin}
      className="w-[max(40vw,400px)] bg-white rounded"
    >
      <div className="flex items-center justify-center pt-4 pb-2">
        <div className="h-full font-semibold text-2xl">LOGIN ACCOUNT</div>
      </div>
      <hr />
      <div className="flex flex-col gap-4 mt-5 px-4 mb-4">
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
        <div className="flex justify-between text-[14px]">
          <p>You haven't account </p>
          <p>Forgot password?</p>
        </div>
      </div>
      <div className="w-full flex justify-center mb-5">
        <button className="w-[150px] py-2 bg-amber-100 rounded font-medium text-[20px]">
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
