import { useState } from "react";
import { forgotPasswordAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";

const ForgotPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(email);
      const res = await forgotPasswordAPI(email);
      if (res.Ec === 0) {
        toast.success(res?.Mes);
        setEmail("");
      } else {
        toast.warning(res?.Mes);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex items-start justify-center w-screen h-screen bg-[#cccccc]">
      <form
        onSubmit={handleSubmit}
        className="w-[max(40vw,400px)] bg-white rounded"
      >
        <div className="flex items-center justify-center pt-4 pb-2">
          FORGOT PASSWORD
        </div>
        <hr />
        <div className="flex flex-col gap-1 mt-4 px-4 mb-3">
          <div>
            <p>
              Vui long nhap email xac thuc tai khoan cua ban, vui long nhap
              chinh xac ....
            </p>
          </div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            name="email"
            placeholder="Enter email ..."
            className="w-full border border-gray-400 py-1 px-2 focus:outline-hidden"
          />
        </div>
        <div className="w-full flex justify-center mb-3">
          <button className="w-[150px] py-2 bg-amber-100 rounded font-medium text-[20px]">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPage;
