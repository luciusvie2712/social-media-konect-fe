import { useEffect } from "react";
import { getDataUserLoginGoogle } from "../../utils/api.customize";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import actiontypes from "../../store/Action/ActionTypes";


const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");
      console.log("Session Id:", sessionId)

      if (!sessionId) {
        toast.error("Missing session id");
        return;
      }

      try {
        const res = await getDataUserLoginGoogle(sessionId);
        // ✅ data backend trả về từ Redis
        const { token, refreshToken, user } = res;
        console.log("Data: ", user)

        // ✅ LƯU LOCALSTORAGE (để reload không mất login)
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ DISPATCH VÀO REDUX (đúng format reducer)
        dispatch({
          type: actiontypes.USER_LOGIN_SUCCESS,
          data: {
            payloadToken: {
              accessToken: token,
              refreshToken: refreshToken,
            },
            data: user,
          },
        });

        toast.success("Đăng nhập Google thành công");
        navigate("/home");
      } catch (err) {
        toast.error("Đăng nhập Google thất bại");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-[24px] text-center mt-10">
      Đang xử lý đăng nhập Google...
    </div>
  );
};

export default GoogleCallback;
