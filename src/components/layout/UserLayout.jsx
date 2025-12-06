import { Outlet, useLocation } from "react-router-dom";
import NavBar from './NavBar';
import MiniChat from "../Message/MiniChat";

const UserLayout = () => {
  const location = useLocation()
  const showMiniChat = location.pathname !== "/message-box"
  return (
    <div className="flex flex-col w-screen h-screen gap-4">
      <NavBar />
      <div className="flex !w-screen h-full !mt-14 overflow-auto px-5">
        <Outlet />
      </div>
      {showMiniChat && <MiniChat />}
    </div>
  );
};

export default UserLayout;