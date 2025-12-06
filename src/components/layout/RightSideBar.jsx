// src/components/RightSideBar.jsx (chỉ phần render list sửa)
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
      <div className="w-full flex items-center gap-2">
        <span className="bg-gray-300 h-[1px] w-4"></span>
        <span className="font-medium">Bạn bè liên hệ</span>
        <span className="bg-gray-300 h-[1px] w-10"></span>
      </div>
      <div className="w-full px-3 flex flex-col items-center">
        {friends?.length > 0 ? (
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
          <span>Không có bạn bè</span>
        )}
      </div>
    </div>
  );
};

export default RightSideBar;
