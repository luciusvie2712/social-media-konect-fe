import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/download.png";
import * as action from "../../store/Export";
import { useEffect, useRef, useState } from "react";
import NotificationModal from "../Modal/Notification.modal";
import axios from "../../utils/axios.customize";
import { getHistorySearch, searchUserByName } from "../../utils/api.customize";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.user);
  const [openModalNotification, setOpenNotification] = useState(false);
  const [logo, setLogo] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [openAvatarMenu, setOpenAvatarMenu] = useState(false);
  const avatarRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {

  }, [account.avatar])

  useEffect(() => {
    const handleClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setOpenAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = () => {
    dispatch(action.logoutUser());
    navigate("/auth");
  };
  useEffect(() => {
    fetchLogo();
  }, []);
  const fetchLogo = async () => {
    try {
      const res = await axios.get("/api/logo"); //env
      setLogo(res?.logo);
    } catch (err) {
      console.error(err);
    }
  };
  const filelogo = `http://localhost:8080${logo}`; //env
  const clickInputSearch = async () => {
    setShowHistory(true);
    if (showHistory) {
      return;
    }
    const historySearch = await getHistorySearch();
    if (historySearch.Ec === 0) {
      setDataHistory(historySearch?.data);
    }
  };
  const clickProfileUser = (item) => {
    navigate(`/profile/${item}`);
    setShowHistory(false);
  };
  const handleSearchName = async (name) => {
    setNameSearch(name);
    if (typingTimeout) clearTimeout(typingTimeout);
    if (!name.trim()) {
      setSearchResult([]);
      setShowHistory(true);
      return;
    }
    const timeout = setTimeout(async () => {
      if (name.length < 2) {
        setSearchResult([]);
        return;
      }
      const result = await searchByName(name);
      setSearchResult(result);
      setShowHistory(false);
    }, 500);
    setTypingTimeout(timeout);
  };
  const searchByName = async (name) => {
    try {
      const res = await searchUserByName(name);
      if (res.Ec === 0) return res.data;
      return [];
    } catch (e) {
      console.log(err);
      return [];
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#ffffff] shadow-md z-50 flex items-center justify-between px-4 py-2 text-black">
      <div className="flex items-center">
        <NavLink to="/home">
          <img
            src={filelogo || avatar}
            className="h-10"
            crossOrigin="use-credentials"
          />
        </NavLink>
      </div>
      <div
        className="relative flex-1 max-w-md mx-4 justify-center !ml-60"
        ref={wrapperRef}
      >
        <input
          value={nameSearch}
          type="search"
          placeholder="Tìm kiếm..."
          className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none focus:bg-gray-200 transition"
          onClick={clickInputSearch}
          onChange={(e) => handleSearchName(e.target.value)}
        />

        {(showHistory || searchResult.length > 0) && (
          <div className="absolute top-[110%] left-0 w-full bg-white shadow-lg rounded-xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">
            {searchResult.length > 0 && (
              <div className="p-3 text-gray-500 text-sm font-semibold border-b">
                Kết quả tìm kiếm
              </div>
            )}
            {showHistory && searchResult.length === 0 && (
              <div className="p-3 text-gray-500 text-sm font-semibold border-b">
                Lịch sử tìm kiếm
              </div>
            )}

            <div className="max-h-64 overflow-y-auto">
              <div className="px-2 py-2">
                {searchResult.length > 0 &&
                  searchResult.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => clickProfileUser(item?._id)}
                    >
                      <img
                        src={item.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {item.name}
                      </span>
                    </div>
                  ))}

                {searchResult.length === 0 &&
                  !showHistory &&
                  nameSearch.length >= 2 && (
                    <div className="py-2 text-sm text-gray-600 text-center">
                      Không tìm thấy người dùng
                    </div>
                  )}
                {showHistory &&
                  searchResult.length === 0 &&
                  (dataHistory.length > 0 ? (
                    dataHistory.map((item, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          clickProfileUser(item?.targetUserId?._id)
                        }
                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        <img
                          src={item.targetUserId.avatar}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {item.targetUserId.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-sm text-gray-600 text-center">
                      Không có lịch sử tìm kiếm
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4 gap-4">
        <NavLink
          to="/friends"
          className="text-xl text-black rounded-full bg-gray-200 px-2 py-2 hover:bg-blue-400 hover:!text-white flex justify-center"
        >
          <i className="fa-solid fa-user-group"></i>
        </NavLink>
        <div
          onClick={() => setOpenNotification(true)}
          className="relative text-xl text-black rounded-full bg-gray-200 px-2 py-2 cursor-pointer hover:bg-blue-400 hover:!text-white flex justify-center"
        >
          <NotificationModal
            show={openModalNotification}
            setShow={setOpenNotification}
            account={account}
          />
          <i className="fa-regular fa-bell"></i>
        </div>
        <NavLink
          to="/message-box"
          className="text-xl text-black rounded-full bg-gray-200 px-2 py-2 hover:bg-blue-400 hover:!text-white flex justify-center no-underline!"
        >
          <i className="fa-solid fa-envelope"></i>
        </NavLink>
        <div className="relative" ref={avatarRef}>
          <div
            onClick={() => setOpenAvatarMenu(!openAvatarMenu)}
            className="cursor-pointer border-2 border-gray-200 hover:border-blue-400 rounded-full"
          >
            <img
              src={account?.avatar || avatar}
              className="w-8 h-8 rounded-full"
            />
          </div>

          {openAvatarMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 animate-fadeIn z-50">
              
              <NavLink
                to={`/profile/${account?.id}`}
                onClick={() => setOpenAvatarMenu(false)}
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 no-underline!"
              >
                Xem trang cá nhân
              </NavLink>
              {account?.role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={() => setOpenAvatarMenu(false)}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 no-underline!"
                >
                  <i className="fa-solid fa-crown w-5 mr-2"></i>Trang quản trị
                </NavLink>
              )}
              <div
                onClick={() => {
                  setOpenAvatarMenu(false);
                  navigate("/settings"); // nếu có route
                }}
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer"
              >
                <i class="fa-solid fa-gear w-5"></i>Cài đặt
              </div>
              <div
                onClick={() => {
                  setOpenAvatarMenu(false);
                  handleLogout();
                }}
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-red-500 cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket w-5"></i>Đăng xuất
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
