import { Outlet, useLocation } from "react-router-dom";
import NavBar from './NavBar';

const UserLayout = () => {
  return (
    <div className="flex flex-col w-screen h-fit gap-4">
      <NavBar />
      <div className="flex w-full h-screen !pt-14 text-white">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;