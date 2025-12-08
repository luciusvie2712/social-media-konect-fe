import { NavLink } from "react-router-dom";
import avatar from "../../assets/download.png";
import { useSelector } from "react-redux";

const LeftSidebar = ({ setIsCreateOpen }) => {
  const { account } = useSelector((state) => state.user)

  return (
    <div className="w-full h-full p-4 rounded flex flex-col gap-6">
      <div className="w-full flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="relative w-full flex justify-center">
          <img
            src={account?.avatar || avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
          />
        </div>

        <div className="text-center">
          <h5 className="font-bold text-lg text-gray-800 truncate max-w-full">
            {account?.name || "Người dùng"}
          </h5>
          <p className="text-sm text-gray-500 truncate max-w-full">
            {account?.email || "user@example.com"}
          </p>
        </div>
        <NavLink
          to={`/profile/${account?.id}`}
          className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 font-medium py-2 px-4 rounded-lg transition duration-200 text-center !no-underline"
        >
          <i className="fa-solid fa-eye mr-2!"></i>
          Xem trang cá nhân
        </NavLink>
      </div>
      
      <div className="w-full flex items-center mt-2">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg! cursor-pointer hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
        >
          <i className="fa-solid fa-plus text-lg"></i>
          Thêm bài viết
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;