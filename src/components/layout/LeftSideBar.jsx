import { NavLink } from "react-router-dom";

const LeftSidebar = () => {
  return (
    <div className="w-full h-full p-4 rounded flex flex-col gap-2">
      <NavLink to="/friends/all" className="flex gap-2 items-center py-2 px-3 rounded !no-underline text-black hover:bg-blue-200 hover:!text-blue-800">
        <i className="fa-solid fa-users mr-2"></i> <span>Bạn bè</span>
      </NavLink>
      <NavLink to="/friends/suggestion" className="flex gap-2 items-center py-2 px-3 rounded !no-underline text-black hover:bg-blue-200 hover:!text-blue-800">
        <i className="fa-solid fa-user-plus mr-2"></i> Gợi ý bạn bè
      </NavLink>
      <NavLink to="/friends/request" className="flex gap-2 items-center py-2 px-3 rounded !no-underline text-black hover:bg-blue-200 hover:!text-blue-800">
        <i className="fa-solid fa-user-check mr-2"></i> Lời mời kết bạn
      </NavLink>
    </div>
  );
};

export default LeftSidebar;