import { NavLink } from "react-router-dom";

const LeftSidebar = () => {
  return (
    <div className="w-full h-full bg-[#242424] border-1 border-[#494949] p-4 rounded">
      <NavLink to="/friends/all" className="block py-2">
        <i className="fa-solid fa-users mr-2"></i> Bạn bè
      </NavLink>
      <NavLink to="/friends/suggestion" className="block py-2">
        <i className="fa-solid fa-user-plus mr-2"></i> Gợi ý bạn bè
      </NavLink>
      <NavLink to="/friends/request" className="block py-2">
        <i className="fa-solid fa-user-check mr-2"></i> Lời mời kết bạn
      </NavLink>
    </div>
  );
};

export default LeftSidebar;