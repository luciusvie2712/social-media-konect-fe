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
      if (!sessionId) {
        toast.error("Missing session id");
        return;
      }

      try {
        const res = await getDataUserLoginGoogle(sessionId);
        console.log("RES:", res);

        // ✅ CHỈ THÀNH CÔNG KHI Ec === 0
        if (res?.Ec === 0) {
          const { token, refreshToken, user } = res.data;

          // ✅ LƯU LOCALSTORAGE
          localStorage.setItem("access_token", token);
          localStorage.setItem("refresh_token", refreshToken);
          localStorage.setItem("user", JSON.stringify(user));

          // ✅ DISPATCH REDUX
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
        } else {
          toast.error(res?.Mes || "Đăng nhập Google thất bại");
        }
      } catch (err) {
        console.error(err);
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
