import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateAuser } from "../../utils/api.customize";
import { useDispatch } from "react-redux";
import * as action from "../../store/Export";

const EditProfileModal = ({ isOpen, onClose, userInfo, onUpdateSuccess }) => {
  const [editForm, setEditForm] = useState({
    name: "",
    avatar: "",
    background: "",
    gender: "",
    address: "",
    education: "",
    bio: "",
    website: "",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && userInfo) {
      setEditForm({
        name: userInfo.name || "",
        avatar: userInfo.avatar || "",
        background: userInfo.background || "",
        gender: userInfo.gender || "",
        address: userInfo.address || "",
        education: userInfo.education || "",
        bio: userInfo.bio || "",
        website: userInfo.website || "",
      });
    }
  }, [isOpen, userInfo]);

  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;

    if ((name === "avatar" || name === "background") && files && files[0]) {
      const file = files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File quá lớn! Vui lòng chọn file dưới 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = () => {
    if (!editForm.name.trim()) {
      toast.error("Tên không được để trống");
      return;
    }

    if (!isFormChanged()) {
      toast.info("Bạn chưa thay đổi thông tin nào");
      return;
    }

    setIsPasswordModalOpen(true);
  };
  const isFormChanged = () => {
    if (!userInfo) return false;

    return (
      editForm.name !== (userInfo.name || "") ||
      editForm.avatar !== (userInfo.avatar || "") ||
      editForm.background !== (userInfo.background || "") ||
      editForm.gender !== (userInfo.gender || "") ||
      editForm.address !== (userInfo.address || "") ||
      editForm.education !== (userInfo.education || "") ||
      editForm.bio !== (userInfo.bio || "") ||
      editForm.website !== (userInfo.website || "")
    );
  };
  const handleConfirmUpdate = async () => {
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    try {
      setIsSaving(true);

      const updateData = {
        _id: userInfo.id,
        name: editForm.name,
        avatar: editForm.avatar,
        background: editForm.background,
        gender: editForm.gender,
        address: editForm.address,
        education: editForm.education,
        bio: editForm.bio,
        website: editForm.website,
        currentPassword: password,
      };

      const res = await updateAuser(updateData);

      if (res?.Ec === 0) {
        toast.success("Cập nhật hồ sơ thành công");

        dispatch(
          action.updateUserInfoAction({
            name: editForm.name,
            avatar: editForm.avatar,
            background: editForm.background,
          })
        );

        if (onUpdateSuccess) {
          onUpdateSuccess({
            name: editForm.name,
            avatar: editForm.avatar,
            background: editForm.background,
            gender: editForm.gender,
            address: editForm.address,
            education: editForm.education,
            bio: editForm.bio,
            website: editForm.website,
          });
        }

        setIsPasswordModalOpen(false);
        onClose();
        setPassword("");
      } else {
        const errorMessage = res?.Mes || "Có lỗi xảy ra";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật hồ sơ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveImage = (field) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal chỉnh sửa hồ sơ */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="absolute inset-0" onClick={onClose}></div>

        <div className="bg-white rounded w-full max-w-5xl max-h-[90vh] overflow-auto z-10 shadow-2xl">
          <div className="w-full sticky top-0 left-0 z-51 flex justify-between items-center border-b border-gray-200 bg-gray-50 shadow-sm px-4 py-3">
            <div className="flex flex-col justify-center">
              <span className="text-xl font-bold text-blue-700">
                Chỉnh sửa hồ sơ
              </span>
              <span className="text-sm text-gray-600 italic">
                Cập nhật thông tin cá nhân của bạn
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full! hover:bg-gray-100"
            >
              <i className="fa-solid fa-xmark text-lg text-gray-600"></i>
            </button>
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
              {/* Cột trái - Hình ảnh */}
              <div className="w-full gap-3 flex flex-col">
                {/* Avatar */}
                <div className="rounded">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Ảnh đại diện
                  </label>
                  <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28 overflow-hidden mb-4">
                      {editForm.avatar ? (
                        <img
                          src={editForm.avatar}
                          alt="Avatar preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="fa-solid fa-user text-2xl text-gray-400"></i>
                        </div>
                      )}
                      {editForm.avatar && (
                        <button
                          onClick={() => handleRemoveImage("avatar")}
                          className="absolute top-0 right-1 w-7 h-7 bg-red-500 text-white rounded-full! flex items-center justify-center hover:bg-red-600"
                        >
                          <i className="fa-solid fa-xmark text-xs"></i>
                        </button>
                      )}
                    </div>

                    <label className="w-full">
                      <div className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 cursor-pointer text-center transition-colors">
                        <p className="text-sm font-medium text-gray-700">
                          Tải ảnh lên
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG • Tối đa 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleEditFormChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Background */}
                <div className="w-full rounded">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Ảnh bìa
                  </label>
                  <div className="flex flex-col items-center">
                    <div className="relative w-full h-32 rounded border border-gray-200 bg-gray-50 overflow-hidden mb-4">
                      {editForm.background ? (
                        <img
                          src={editForm.background}
                          alt="Background preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <i className="fa-solid fa-image text-2xl text-gray-400 mb-2"></i>
                          <p className="text-sm text-gray-500">
                            Chưa có ảnh bìa
                          </p>
                        </div>
                      )}
                      {editForm.background && (
                        <button
                          onClick={() => handleRemoveImage("background")}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full! flex items-center justify-center hover:bg-red-600"
                        >
                          <i className="fa-solid fa-xmark text-xs"></i>
                        </button>
                      )}
                    </div>

                    <label className="w-full">
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:border-blue-500 cursor-pointer text-center transition-colors">
                        <p className="text-sm font-medium text-gray-700">
                          Tải ảnh bìa lên
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG • Tối đa 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        name="background"
                        accept="image/*"
                        onChange={handleEditFormChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Cột phải - Thông tin */}
              <div className="w-full">
                {/* Tên */}
                <div className="w-full flex flex-col justify-center">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <span className="text-red-500">*</span> Tên hiển thị
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên của bạn"
                    required
                  />
                </div>

                {/* Giới tính & Địa chỉ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Giới tính
                    </label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editForm.address}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  </div>
                </div>

                {/* Học vấn & Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Học vấn
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={editForm.education}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ví dụ: Đại học Bách Khoa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={editForm.website}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Giới thiệu bản thân */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleEditFormChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Giới thiệu ngắn gọn về bản thân..."
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-gray-500">
                      Tối đa 1000 ký tự
                    </div>
                    <div
                      className={`text-sm ${
                        editForm.bio.length > 900
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {editForm.bio.length}/1000
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="sticky bottom-0 z-51 flex justify-end items-center gap-3 py-3 px-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-6! py-2 font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="px-8! py-2 font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận mật khẩu */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div
            className="absolute inset-0"
            onClick={() => setIsPasswordModalOpen(false)}
          ></div>

          <div className="relative bg-white rounded w-full max-w-md z-10 shadow-2xl">
            {/* Header */}
            <div className="w-full border-b border-gray-200 flex flex-col px-3 py-2">
              <span className="text-lg font-bold text-red-500">
                Xác nhận mật khẩu
              </span>
              <span className="text-sm text-gray-600 italic">
                Chúng tôi cần xác nhận bạn là chủ tài khoản này
              </span>
            </div>

            {/* Form mật khẩu */}
            <div className="w-full flex flex-col gap-3">
              <div className="w-full flex flex-col py-4 px-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <span className="text-red-500">*</span> Mật khẩu của bạn
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              {/* Action buttons */}
              <div className="w-full flex justify-end gap-3  border-t border-gray-200 py-3 px-3 items-center">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-2 font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUpdate}
                  disabled={isSaving || !password}
                  className="px-6! py-2 font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileModal;
