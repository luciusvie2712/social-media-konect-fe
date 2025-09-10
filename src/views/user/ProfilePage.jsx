import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAUserByIdAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";
import avatar from "../../assets/download.png";
import "../../assets/styles/Profile.scss";
import bgImage from "../../assets/image/bg_image_profile_2.jpg";
import ColorThief from "colorthief";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const user = useSelector((state) => state.user.account);
  const [bgColor, setBgColor] = useState([0, 0, 0]);

  useEffect(() => {
    const fetchAUser = async () => {
      try {
        if (!user?.id) return;
        const res = await getAUserByIdAPI(user.id);
        console.log(res);
        if (res.Ec === 0) {
          setUserData(res.data);
        } else {
          toast.warning(res.Mes);
        }
      } catch (error) {
        toast.error("Error went load data");
      }
    };
    fetchAUser();
  }, [user?.id]);

  return (
    <div
      className="display-profile__content"
      style={{
        background: `linear-gradient(to bottom, rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.4), rgba(0,0,0,0.9))`,
      }}
    >
      {userData ? (
        <>
          <div className="display-profile__header-profile">
            <img
              src={bgImage}
              alt="cover"
              crossOrigin="anonymous"
              style={{ opacity: 0, position: "absolute", zIndex: -9999 }}
              onLoad={(e) => {
                try {
                  const colorThief = new ColorThief();
                  const [r, g, b] = colorThief.getColor(e.target);
                  setBgColor([r, g, b]);
                  console.log("Màu lấy được:", r, g, b);
                } catch (err) {
                  console.error("Không lấy được màu:", err);
                }
              }}
            />
            <div className="header-profile__avatar">
              <img
                src={userData?.avatar || avatar}
                className="rounded-full w-[150px] border-4 cursor-pointer"
              />
            </div>
            <div className="header-profile__info">
              <div className="info__title">
                <h2>{userData.name}</h2>
              </div>
              <div className="info__sub-info">
                <p className="sub-info">
                  <b>0</b> bài viết
                </p>
                <p className="sub-info">
                  <b>10</b> người theo dõi
                </p>
                <p className="sub-info">
                  Đang theo dõi <b>102</b> người
                </p>
              </div>
              <div className="header-profile__btn-edit">
                <button className="btn-edit-profile">
                  Chỉnh sửa trang cá nhân
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <h3>Bài viết đã đăng</h3>
            <hr />
            <div className="w-full h-[500px] flex justify-center items-center">
              <h1>CHƯA CÓ BÀI VIẾT NÀO</h1>
            </div>
          </div>
        </>
      ) : (
        <p>Loading ...</p>
      )}
    </div>
  );
};

export default ProfilePage;
