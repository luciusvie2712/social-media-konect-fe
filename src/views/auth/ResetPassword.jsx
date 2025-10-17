import axios from "../../utils/axios.customize";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPass, setNewPass] = useState("");
  const [confirmPassword, setConfirmPass] = useState("");
  const navigate = useNavigate();
  const handleResetPass = async (e) => {
    console.log("eqweqweqw");
    e.preventDefault();
    if (!comparePassword()) {
      toast.error("mat khau nhap lai khong chinh xac");
      return;
    }
    try {
      const data = await axios.post(`/api/reset-password/${token}`, {
        newPass,
      });
      if (data?.Ec === 0) {
        toast.success(data.Mes);
        navigate("/auth");
        setNewPass("");
        setConfirmPass("");
      } else {
        toast.error(data?.Mes);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const comparePassword = () => {
    if (!newPass || !confirmPassword) return false;
    return newPass === confirmPassword;
  };
  return (
    <div className="flex items-start justify-center w-screen h-screen bg-[#cccccc]">
      <form
        className="w-[max(40vw,400px)] bg-white rounded"
        onSubmit={handleResetPass}
      >
        <div className="flex items-center justify-center pt-4 pb-2">
          RESET PASSWORD
        </div>
        <hr />
        <div className="flex flex-col gap-2 mt-4 mb-4">
          <div className="flex flex-col gap-1 px-4">
            <label>Nhap mat khau moi: </label>
            <input
              type="password"
              className="w-full border border-gray-400 py-1 px-2 focus:outline-hidden"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 px-4">
            <label>Xac nhan mat khau: </label>
            <input
              type="password"
              className="w-full border border-gray-400 py-1 px-2 focus:outline-hidden"
              value={confirmPassword}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="w-full flex justify-center mb-3">
          <button
            className="w-[150px] py-2 bg-amber-100 rounded font-medium text-[20px]"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
