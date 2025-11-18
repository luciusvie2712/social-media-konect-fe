import { NavLink } from "react-router-dom";

const LeftSidebar = ({ setIsCreateOpen }) => {
  
  return (
    <div className="w-full h-full p-4 rounded flex flex-col gap-4 bg-white border-1 border-gray-200">
      <div className="w-full flex flex-col gap-2"> 
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
      <div className="w-full flex items-center">
        <div onClick={() => setIsCreateOpen(true)} className="bg-blue-400 text-white px-4 py-2 rounded cursor-pointer hover:opacity-90">
            Thêm bài viết
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;