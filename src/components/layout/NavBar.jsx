import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/download.png";
import * as action from "../../store/Export";
import { useEffect, useState } from "react";
import NotificationModal from "../Modal/Notification.modal";
import axios from "../../utils/axios.customize";
import { getHistorySearch } from "../../utils/api.customize";
const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.user);
  const [openModalNotification, setOpenNotification] = useState(false);
  const [logo, setLogo] = useState("");

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
    const historySearch = await getHistorySearch();
    console.log("history search", historySearch);
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
      <div className="flex-1 max-w-md mx-4 justify-center !ml-60">
        <input
          type="search"
          placeholder="Tìm kiếm ..."
          className="w-full bg-gray-200 rounded-[20px] px-4 py-1 outline-none"
          onClick={() => clickInputSearch()}
        />
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
