import { useEffect, useState } from "react";
import { getAUserByIdAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";
import avatar from "../../assets/download.png";
import "../../styles/ProfilePage.scss";
import { useParams } from "react-router-dom";
import bgDemo from "../../assets/image/bg_image_profile_2.jpg"

const ProfilePage = () => {
  const [ userData, setUserData ] = useState([])
  const { id } = useParams()
  console.log(">>>> User: ", userData)

  useEffect(() => {
    const fetchAUser = async () => {
      try {
        if (!id) return;
        const res = await getAUserByIdAPI(id);
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
  }, [id]);

  return (
    <div className="container">
      {/* Header Profile */}
      <div className="header-profile">
        <div className="header-profile__background">
          <div className="background">
            {userData?.background ? (
              <img src={userData.backgroud} alt="background-profile" />
            ) : (
              <img src={bgDemo} alt="" />
            )}
          </div>
        </div>
        <div className="header-profile__user">
          <div className="user__detail">
            <div className="avatar-user">
              <img src={userData?.avatar || avatar} />
            </div>
            <div className="fullname-user">
              <span>{userData?.name}</span>
            </div>
          </div>
          <div className="user__edit">
            <button className="btn-edit">
              <i className="fa-solid fa-pen w-4"></i>
              <span>Chỉnh sửa thông tin</span>
            </button>
          </div>
        </div>
        <div className="header-profile__stats">
          <div className="stats-item">
            <span>1,204</span>
            <span>Bài viết</span>
          </div>
           <div className="stats-item">
            <span>156</span>
            <span>Bạn bè</span>
          </div>
           <div className="stats-item">
            <span>5,236</span>
            <span>Người theo dõi</span>
          </div>
        </div>

        <div className="header-profile__active-nav">
          <div className="active-option">
            Bài viết
          </div>
          <div className="active-option">
            Giới thiệu
          </div>
          <div className="active-option">
            Bạn bè
          </div>
        </div>
      </div>

      {/* Body Profile */}
      <div className="body-profile">

      </div>
    </div>
  );
};

export default ProfilePage;
