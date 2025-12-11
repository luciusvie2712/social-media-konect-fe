import { useEffect, useState } from "react";
import { loginUserAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../../store/Export";
import iconGG from "../../assets/image/icon_gg.png"

const LoginForm = ({ setFormType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    
    setIsLoading(true);
    try {
      dispatch(action.loginUserRedux(email, password));
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isauthentic === true) {
      toast.success(`Chào mừng ${user.account.name}!`);
      navigate("/home");
    }
  }, [user]);

  const apiGoogle = import.meta.env.VITE_URL_GOOGLE;

  const handleLoginGoogle = async () => {
    window.location.href = apiGoogle;
  };

  return (
      <div className="w-full max-w-md">
        <div className="w-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="w-full flex flex-col items-center justify-center py-4 bg-gradient-to-br from-blue-600 to-pink-500">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-lock text-white text-xl"></i>
              </div>
            </div>
            <span className="text-3xl font-bold text-white">Đăng nhập tài khoản</span>
            <span className="text-blue-100 text-sm mt-3">Chào mừng bạn trở lại!</span>
          </div>
          {/* Form */}
          <form onSubmit={handleLogin} className="w-full flex flex-col px-3 py-3">
            <div className="w-full flex flex-col justify-center">
              <label className="w-full block text-sm font-medium text-gray-700 mb-2">
                <i className="fa-solid fa-envelope text-blue-500 mr-2!"></i>
                Email
              </label>
              <div className="relative w-full">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10! pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  type="email"
                  id="email"
                  placeholder="Nhập email của bạn"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="w-full flex flex-col justify-center py-2">
              <label className="w-full block text-sm font-medium text-gray-700 mb-2">
                <i className="fa-solid fa-lock text-blue-500 mr-2!"></i>
                Mật khẩu
              </label>
              <div className="w-full relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10! pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu của bạn"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Quên?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 mt-3 bg-gradient-to-r from-blue-700 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket mr-2!"></i>
                  Đăng nhập
                </>
              )}
            </button>

            <div className="flex items-center my-3!">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 font-medium">Hoặc đăng nhập với</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleLoginGoogle}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
            >
              <img src={iconGG} alt="Google" className="w-5 h-5" />
              <span className="font-medium text-gray-700">Đăng nhập với Google</span>
            </button>

            <div className="text-center pt-3">
              <p className="text-gray-600">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setFormType("register")}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  disabled={isLoading}
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>

          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <button className="text-blue-600 hover:underline">Điều khoản dịch vụ</button>{" "}
            và <button className="text-blue-600 hover:underline">Chính sách bảo mật</button>
          </p>
        </div>
      </div>
  );
};

export default LoginForm;