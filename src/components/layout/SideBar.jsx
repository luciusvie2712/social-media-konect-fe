import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import actiontypes from "../../store/Action/ActionTypes";
import avatar from "../../assets/download.png";
import "../../styles/SideBar.scss"
import bigLogo from "../../assets/image/big_logo-removebg-preview.png";
import smallLogo from "../../assets/image/small_logo.jpg";
import * as action from "../../store/Export";
import { useState } from "react";
import CreatePostModal from "../Modal/createPost.modal";
import NotificationModal from "../Modal/Notification.modal";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account, isauthentic } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [openModalNotification, setOpenotification] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(action.logoutUser());
    navigate("/auth");
  };

  const openModalCreatePost = () => {
    setIsOpen(true);
  };

  const isFriendList = /^\/friends\/(request|suggestion)/.test(location.pathname);
  const isFriendPage = /^\/friends\/.+/.test(location.pathname);

  return (
    <div className={`sidebar-container ${isFriendList ? "compact" : "full"}`}>
      <div className="sidebar__option">
        <div className="sidebar__logo">
          {isFriendPage ? (
            <img src={smallLogo} alt="Logo nhỏ" className="logo" />
          ) : (
            <picture>
              <source srcSet={smallLogo} media="(max-width: 1260px)" />
              <img src={bigLogo} alt="Logo lớn" className="logo" />
            </picture>
          )}
        </div>
        <NavLink to={`/home`} className={`sidebar__option-item ${isFriendList ? "compact" : "full"}`}>
          <i className="fa-solid fa-house"></i>
          <div className="option-title">Trang chủ</div>
        </NavLink>
        <NavLink to={`/friends`} className={`sidebar__option-item ${isFriendList ? "compact" : "full"}`}>
          <i className="fa-solid fa-users"></i>
          <div className="option-title">Bạn bè</div>
        </NavLink>
        <div className={`sidebar__option-item ${isFriendList ? "compact" : "full"}`}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <div className="option-title">Tìm kiếm</div>
        </div>
        <div className={`sidebar__option-item ${isFriendList ? "compact" : "full"}`}>
          <i className="fa-solid fa-bell"></i>
          <div
            className="option-title"
            onClick={() => setOpenotification(true)}
          >
            Thông báo
          </div>
        </div>
        <NavLink to={`/message-box`} className={`sidebar__option-item ${isFriendList ? "compact" : "full"}`}>
          <i className="fa-solid fa-paper-plane"></i>
          <div className="option-title">Tin nhắn</div>
        </NavLink>
        <div className={`sidebar__option-item ${isFriendList ? "compact" : "full"}`} onClick={openModalCreatePost}>
          <i className="fa-regular fa-square-plus"></i>
          <div className="option-title">Tạo mới</div>
        </div>
      </div>
      <div className="sidebar__menu">
        <NavLink
          to={`/profile/${account?.id}`}
          className={`sidebar__menu-option ${isFriendList ? "compact" : "full"}`}
        >
          <img src={account?.avatar || avatar} className="avatar-user" />
          <div className="option-title">Trang cá nhân</div>
        </NavLink>
        <div className={`sidebar__menu-option ${isFriendList ? "compact" : "full"}`}>
          <i className="fa-solid fa-bars w-[25px]"></i>
          <div className="option-title">Cài đặt</div>
        </div>
        <div className={`sidebar__menu-option ${isFriendList ? "compact" : "full"}`}>
          <i className="fa-solid fa-right-from-bracket w-[25px]"></i>
          <div className="option-title" onClick={handleLogout}>
            Đăng xuất
          </div>
        </div>
      </div>
      {isOpen && (
        <CreatePostModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          account={account}
        />
      )}
      <NotificationModal
        show={openModalNotification}
        setShow={setOpenotification}
        account={account}
      />
    </div>
  );
};

export default SideBar;
