import { useEffect } from "react";
import { getDataUserLoginGoogle } from "../../utils/api.customize";
import { toast } from "react-toastify";

const GoogleCallback = () => {
  useEffect(async () => {
    const params = new URLSearchParams(window.location.search);
    const sesssionId = params.get("session_id");
    console.log("hehehehe", params, sesssionId);
    if (sesssionId) {
      let data = await getDataUserLoginGoogle(sesssionId);
      if (data) {
        ///abcdxyz luu xog => ve trang chu
      } else {
        toast.error("an error occurred");
      }
    }
  }, []);
  return (
    <>
      <div className="text-[100px]">Chị dựng hông có nổi em ơi</div>
    </>
  );
};
export default GoogleCallback;
