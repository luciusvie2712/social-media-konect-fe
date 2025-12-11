import { useState } from "react";
import { forgotPasswordAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await forgotPasswordAPI(email);
      if (res.Ec === 0) {
        toast.success(res?.Mes);
        setEmail("");
        setIsSubmitted(true);
      } else {
        toast.warning(res?.Mes);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="w-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="w-full flex flex-col justify-center items-center py-3 bg-gradient-to-r from-red-500 to-pink-600">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-key text-white text-xl"></i>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">Quên mật khẩu</span>
            <span className="text-red-100 text-sm mt-2">Khôi phục tài khoản của bạn</span>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center">
              <div className="px-3 py-3 bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-info-circle text-blue-500 mt-0.5"></i>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-blue-800 mb-1">Hướng dẫn:</span>
                    <span className="text-sm text-blue-600">
                      Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn.
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col justify-center px-3 py-4">
                <label className="w-full block text-sm font-medium text-gray-700 mb-2">
                  <i className="fa-solid fa-envelope text-red-500 mr-2!"></i>
                  Địa chỉ email
                </label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    name="email"
                    placeholder="Nhập địa chỉ email của bạn"
                    className="w-full pl-10! pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <i className="fas fa-exclamation-circle mr-1!"></i>
                  Đảm bảo nhập chính xác email đã đăng ký
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane mr-2"></i>
                    Gửi liên kết đặt lại mật khẩu
                  </>
                )}
              </button>

              <div className="text-center pt-3 py-3">
                <button
                  type="button"
                  onClick={() => navigate("/auth")}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                  disabled={isLoading}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  Quay lại trang đăng nhập
                </button>
              </div>
            </form>
          ) : (
            <div className="w-full text-center">
              <div className="w-15 h-15 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-check text-4xl text-green-600"></i>
              </div>
              
              <h3 className="text-sm font-bold text-gray-800 mb-3">Yêu cầu đã được gửi!</h3>
              
              <div className="w-full flex items-center py-2 px-3 bg-green-50 border border-green-100">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-envelope-open-text text-green-500 mt-1"></i>
                  <div className="text-left">
                    <p className="text-sm font-medium text-green-800 mb-1">Kiểm tra email của bạn</p>
                    <span className="text-sm text-green-600">
                      Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn. 
                      Vui lòng kiểm tra hộp thư đến và thư rác.
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="w-full">
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Quay lại đăng nhập
                </button>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-lightbulb text-blue-500 mt-0.5"></i>
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-800 mb-1">Không nhận được email?</p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li className="flex items-start gap-2">
                        <i className="fas fa-check text-green-500 mt-0.5"></i>
                        Kiểm tra thư mục spam/quảng cáo
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fas fa-check text-green-500 mt-0.5"></i>
                        Đảm bảo email nhập chính xác
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fas fa-check text-green-500 mt-0.5"></i>
                        Chờ vài phút rồi thử lại
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            <i className="fa-solid fa-shield-alt mr-1"></i>
            Thông tin của bạn được bảo mật. Chúng tôi không chia sẻ email của bạn với bên thứ ba.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPage;