import { Outlet, useLocation } from "react-router-dom";
import NavBar from './NavBar';

const UserLayout = () => {
  return (
    <div className="flex flex-col w-screen h-screen gap-4">
      <NavBar />
      <div className="flex w-full h-full !mt-14 px-5 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;