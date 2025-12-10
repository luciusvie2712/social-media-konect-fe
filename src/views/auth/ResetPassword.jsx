import axios from "../../utils/axios.customize";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPass, setNewPass] = useState("");
  const [confirmPassword, setConfirmPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleResetPass = async (e) => {
    e.preventDefault();
    
    if (!comparePassword()) {
      toast.error("Mật khẩu nhập lại không chính xác");
      return;
    }
    
    if (newPass.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await axios.post(`/api/reset-password/${token}`, {
        newPass,
      });
      
      if (data?.Ec === 0) {
        toast.success("✅ " + data.Mes);
        navigate("/auth");
        setNewPass("");
        setConfirmPass("");
      } else {
        toast.error("❌ " + (data?.Mes || "Đã xảy ra lỗi"));
      }
    } catch (e) {
      console.log(e);
      toast.error("❌ Không thể kết nối đến máy chủ");
    } finally {
      setIsLoading(false);
    }
  };

  const comparePassword = () => {
    if (!newPass || !confirmPassword) return false;
    return newPass === confirmPassword;
  };

  const passwordStrength = newPass.length >= 8 && /[A-Z]/.test(newPass) && /[0-9]/.test(newPass);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="w-full flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="w-full flex flex-col py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-center">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-key text-white text-xl"></i>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">Đặt lại mật khẩu</span>
            <span className="text-amber-100 text-sm m">Tạo mật khẩu mới cho tài khoản của bạn</span>
          </div>

          <form onSubmit={handleResetPass} className="w-full flex flex-col justify-center py-3">
            <div className="w-full flex flex-col px-3 justify-center">
              <label className="w-full block text-sm font-medium text-gray-700 mb-2">
                <i className="fa-solid fa-lock text-orange-500 mr-2!"></i>
                Mật khẩu mới
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10! pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'} text-sm`}></i>
                </button>
              </div>
              
              {newPass.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Độ mạnh mật khẩu:</span>
                    <span className={`text-xs font-medium ${passwordStrength ? 'text-green-600' : 'text-yellow-600'}`}>
                      {passwordStrength ? 'Mạnh' : 'Trung bình'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        newPass.length >= 12 ? 'bg-green-500' :
                        newPass.length >= 8 ? 'bg-yellow-500' :
                        newPass.length >= 6 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(newPass.length * 8, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className={`text-xs ${newPass.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                      <i className={`fas fa-${newPass.length >= 6 ? 'check-circle' : 'circle'} mr-1`}></i>
                      Ít nhất 6 ký tự
                    </div>
                    <div className={`text-xs ${newPass.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      <i className={`fas fa-${newPass.length >= 8 ? 'check-circle' : 'circle'} mr-1`}></i>
                      Ít nhất 8 ký tự
                    </div>
                    <div className={`text-xs ${/[A-Z]/.test(newPass) ? 'text-green-600' : 'text-gray-400'}`}>
                      <i className={`fas fa-${/[A-Z]/.test(newPass) ? 'check-circle' : 'circle'} mr-1`}></i>
                      Chữ hoa
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col px-3 py-3">
              <label className="w-full block text-sm font-medium text-gray-700 mb-2">
                <i className="fa-solid fa-lock text-orange-500 mr-2!"></i>
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full pl-10! pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    confirmPassword.length > 0 && !comparePassword() 
                      ? 'border-red-500 ring-2 ring-red-100' 
                      : 'border-gray-300'
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'} text-sm`}></i>
                </button>
              </div>
              
              {confirmPassword.length > 0 && (
                <div className="mt-2 flex items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                    comparePassword() ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <i className={`fas text-xs ${comparePassword() ? 'fa-check' : 'fa-times'}`}></i>
                  </div>
                  <span className={`text-sm ${comparePassword() ? 'text-green-600' : 'text-red-600'}`}>
                    {comparePassword() ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !comparePassword() || newPass.length < 6}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-key mr-2!"></i>
                  Đặt lại mật khẩu
                </>
              )}
            </button>

            <div className="w-full p-3 bg-blue-50 rounded border border-blue-100">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-lightbulb text-blue-500 mt-1"></i>
                <div className="flex flex-col items-start justify-start">
                  <p className="text-sm font-medium text-blue-800 mb-2">Mẹo bảo mật:</p>
                  <ul className="text-xs text-blue-600 p-0! m-0!">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Sử dụng ít nhất 8 ký tự
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Kết hợp chữ hoa, chữ thường và số
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      Tránh sử dụng thông tin cá nhân
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center w-full flex justify-center py-2">
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="text-orange-600 hover:text-orange-800 font-medium transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <i className="fa-solid fa-arrow-left"></i>
                Quay lại trang đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;