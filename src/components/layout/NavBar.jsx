import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/download.png";
import * as action from "../../store/Export";
import { useEffect, useRef, useState } from "react";
import NotificationModal from "../Modal/Notification.modal";
import axios from "../../utils/axios.customize";
import { getHistorySearch } from "../../utils/api.customize";
import { set } from "lodash";
import { data } from "react-router";
const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.user);
  const [openModalNotification, setOpenNotification] = useState(false);
  const [logo, setLogo] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const wrapperRef = useRef(null);

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
      const res = await axios.get("http://localhost:8080/api/logo"); //env
      console.log(res.logo);
      setLogo(res?.logo);
    } catch (err) {
      console.error(err);
    }
  };
  const filelogo = `http://localhost:8080${logo}`;
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
    //  navigate(`/profile/${item.targetUserId.id}`);
    setShowHistory(false);
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
          type="search"
          placeholder="Tìm kiếm..."
          className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none focus:bg-gray-200 transition"
          onClick={clickInputSearch}
        />

        {showHistory && (
          <div className="absolute top-[110%] left-0 w-full bg-white shadow-lg rounded-xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">
            <div className="p-3 text-gray-500 text-sm font-semibold border-b">
              Lịch sử tìm kiếm
            </div>

            <div className="max-h-64 overflow-y-auto">
              <div className="px-2 py-2">
                {dataHistory && dataHistory.length > 0 ? (
                  dataHistory.map((item, index) => (
                    <div
                      onClick={() => clickProfileUser(item?.targetUserId?._id)}
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <img
                        src={item.targetUserId.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {item.targetUserId.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-2 text-sm text-gray-600">
                    Không có lịch sử tìm kiếm
                  </div>
                )}
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
          <i class="fa-solid fa-envelope"></i>
        </NavLink>
        <div className="text-xl text-black rounded-full bg-gray-200 px-2 py-2 cursor-pointer hover:bg-blue-400 hover:!text-white flex justify-center">
          <i class="fa-solid fa-gear"></i>
        </div>
        <div
          onClick={handleLogout}
          className="text-xl text-black rounded-full bg-gray-200 px-2 py-2 cursor-pointer hover:bg-blue-400 hover:!text-white flex justify-center"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </div>
        <NavLink
          to={`/profile/${account?.id}`}
          className=" border-2 border-gray-200 hover:border-blue-400 rounded-full"
        >
          <img
            src={account?.avatar || avatar}
            className="w-8 h-8 rounded-full"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;
