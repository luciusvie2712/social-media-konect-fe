import { useSelector } from "react-redux";
import ShowListFriends from "../Friends/ShowListFriends";
import { useFriendList } from "../../hook/useFriendList";

const RightSideBar = () => {
  const type = "all";
  const user = useSelector((state) => state.user.account);
  const { friends, loading } = useFriendList(type, user?.id);

  const handleOpenMini = (friend) => {
    window.dispatchEvent(new CustomEvent("openMiniChat", { detail: { friendId: friend._id || friend.userId, friendData: friend } }));
  };

  return (
    <div className="w-full text-black flex flex-col gap-2 !pt-4">
      <div className="w-full flex items-center gap-2 px-3">
        <span className="bg-gray-300 h-[1px] w-4"></span>
        <span className="font-medium">Bạn bè liên hệ</span>
        <span className="bg-gray-300 h-[1px] w-10"></span>
      </div>
      <div className="w-full px-3 flex flex-col items-center">
        {loading ? (
          <div className="w-full flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : friends?.length > 0 ? (
          friends.map((item, index) => (
            <div
              key={item._id || index}
              className="w-full cursor-pointer"
              onClick={() => handleOpenMini(item)}
            >
              <ShowListFriends typeList={type} item={item} />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-6 select-none">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <i className="fa-solid fa-user-group text-gray-400"></i>
            </div>
            <p className="text-gray-600 text-sm font-medium">Chưa có bạn bè</p>
            <p className="text-gray-400 text-xs mt-1">Kết nối để thêm bạn bè</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSideBar;