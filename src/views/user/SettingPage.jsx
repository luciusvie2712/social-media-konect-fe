// src/pages/Settings.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import avatar from "../../assets/download.png";
import { toast } from "react-toastify";
import { updateAuser } from "../../utils/api.customize"; // Bạn cần tạo API này

const Settings = () => {
  const user = useSelector((state) => state.user.account);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateAuser({
        _id: user.id,
        currentPassword,
        newPassword
      });

      if (res?.Ec === 0) {
        toast.success("Đổi mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.Mes || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-auto">
      <div className="w-full flex px-4 items-center pt-4">
        <div className="w-full flex flex-col justify-start px-4 py-2 lg:w-1/3">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Cài đặt tài khoản</h1>
                <span className="text-gray-600">Quản lý thông tin và bảo mật tài khoản của bạn</span>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full">
                    <div className="bg-white w-full rounded shadow-lg border border-gray-200 px-3 py-3">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="relative mb-4">
                            <img
                                src={user?.avatar || avatar}
                                alt={user?.name}
                                className="w-22 h-22 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div className="absolute -bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <i className="fa-solid fa-check text-white text-xs"></i>
                            </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{user?.name}</h2>
                            <p className="text-gray-600 text-sm mb-2">{user?.email}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <i className="fa-solid fa-user-shield"></i>
                                <span>Tài khoản đã xác thực</span>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-3 pt-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <i className="fa-solid fa-shield-alt text-blue-600"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Bảo mật tài khoản</h4>
                                        <p className="text-sm text-gray-600">Cập nhật mật khẩu thường xuyên</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <i className="fa-solid fa-info-circle text-green-600"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Thông tin tài khoản</h4>
                                        <p className="text-sm text-gray-600">Chỉnh sửa trong trang cá nhân</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full lg:w-2/3">
            <div className="bg-white rounded shadow-lg border border-gray-200 w-full">
                <div className="w-full px-3 py-3">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đổi mật khẩu</h2>
                    <span className="text-gray-600">
                        Để bảo mật tài khoản, vui lòng sử dụng mật khẩu mạnh và không chia sẻ với ai.
                    </span>
                </div>

                <form onSubmit={handleChangePassword} className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col justify-center px-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fa-solid fa-lock text-blue-500 mr-2!"></i>
                            Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full pl-10! pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập mật khẩu hiện tại"
                                required
                                disabled={isLoading}
                            />
                            <i className="fa-solid fa-key absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    <div className="w-full flex flex-col justify-center px-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fa-solid fa-lock text-green-500 mr-2!"></i>
                            Mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-10! pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                required
                                disabled={isLoading}
                            />
                            <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                        {newPassword.length > 0 && (
                            <div className="mt-2">
                                <div className="text-xs text-gray-500 mb-1">
                                Độ mạnh: 
                                <span className={`ml-2 font-medium ${
                                    newPassword.length >= 8 ? 'text-green-600' : 
                                    newPassword.length >= 6 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    {newPassword.length >= 8 ? 'Mạnh' : 
                                    newPassword.length >= 6 ? 'Trung bình' : 'Yếu'}
                                </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                        newPassword.length >= 8 ? 'bg-green-500' :
                                        newPassword.length >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${Math.min(newPassword.length * 12.5, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full flex flex-col justify-center px-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fa-solid fa-lock text-purple-500 mr-2!"></i>
                            Nhập lại mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pl-10! pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                confirmPassword.length > 0 && newPassword !== confirmPassword 
                                    ? 'border-red-500 ring-2 ring-red-100' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="Nhập lại mật khẩu mới"
                                required
                                disabled={isLoading}
                            />
                            <i className="fa-solid fa-redo absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        
                            {confirmPassword.length > 0 && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        newPassword === confirmPassword 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-red-100 text-red-600'
                                    }`}>
                                        <i className={`fas text-sm ${
                                        newPassword === confirmPassword ? 'fa-check' : 'fa-times'
                                        }`}></i>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                            <p className="mt-2 text-sm text-red-600">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                Mật khẩu nhập lại không khớp
                            </p>
                        )}
                    </div>

                    <div className="w-full px-3">
                        <div className="flex items-start bg-blue-50 rounded border border-blue-100 px-3 gap-3 py-3">
                            <i className="fa-solid fa-lightbulb text-blue-500 mt-1"></i>
                            <div>
                                <h4 className="font-medium text-blue-800 mb-2">Mẹo tạo mật khẩu mạnh:</h4>
                                <ul className="text-sm text-blue-600 p-0! m-0!">
                                <li className="flex items-center gap-2">
                                    <i className="fas fa-check-circle text-green-500"></i>
                                    Sử dụng ít nhất 8 ký tự
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="fas fa-check-circle text-green-500"></i>
                                    Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="fas fa-check-circle text-green-500"></i>
                                    Không sử dụng thông tin cá nhân (tên, ngày sinh)
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="fas fa-check-circle text-green-500"></i>
                                    Đổi mật khẩu định kỳ 3-6 tháng
                                </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center">
                        <button
                        type="submit"
                        disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-b! hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                        {isLoading ? (
                            <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Đang xử lý...
                            </>
                        ) : (
                            <>
                            <i className="fa-solid fa-key mr-2!"></i>
                            Đổi mật khẩu
                            </>
                        )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;