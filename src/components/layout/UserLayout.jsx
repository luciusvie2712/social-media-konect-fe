import { Outlet, useLocation } from "react-router-dom";
import NavBar from './NavBar';

const UserLayout = () => {
  return (
    <div className="flex flex-col w-screen h-screen gap-4">
      <NavBar />
      <div className="flex !w-screen h-full !mt-14 overflow-auto px-5">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;