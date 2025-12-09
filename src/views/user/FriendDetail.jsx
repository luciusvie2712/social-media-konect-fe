import { useNavigate, useParams } from "react-router-dom";
import ShowListFriends from "../../components/Friends/ShowListFriends";
import "../../styles/FriendDetail.scss";
import { useMemo, useState } from "react";
import Profile from "../user/ProfilePage";
import { useSelector } from "react-redux";
import { useFriendList } from "../../hook/useFriendList";

const FriendDetail = () => {
  const { type, friendId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.account);
  const { friends, loading } = useFriendList(type, user?.id);
  console.log("Friends: ", friends)

  const selectedFriend = useMemo(() => friends?.find((i) => i?._id?.toString() === friendId), [friends, friendId])

  return (
    <div className="friend-container">
      <div className="nav-left">
        <div className="header-nav">
          <div onClick={() => navigate(-1)} className="btn-back">
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <span>
            {type === "request" && "Lời mời kết bạn"}
            {type === "suggestion" && "Gợi ý kết bạn"}
            {type === "all" && "Tất cả bạn bè"}
          </span>
        </div>
        {type === "all" && (
          <div className="friend-search">
            <i className="fa-solid fa-magnifying-glass w-4 opacity-45"></i>
            <input type="search" placeholder="Tìm kiếm bạn bè" />
          </div>
        )}
        <div className="show-list">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm mt-2">Đang tải...</p>
            </div>
          ) : friends?.length > 0 ? (
            friends.map((item, index) => (
              <ShowListFriends
                typeList={type}
                key={index}
                item={item}
                onSelect={() => navigate(`/friends/${type}/${item._id}`)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <i className="fa-solid fa-user-group text-3xl text-gray-300 mb-3"></i>
              <p className="text-gray-600 font-medium">Không có dữ liệu</p>
              <p className="text-gray-500 text-sm mt-1">
                {type === "request" && "Bạn chưa có lời mời kết bạn nào"}
                {type === "suggestion" && "Không có gợi ý kết bạn nào"}
                {type === "all" && "Bạn chưa có bạn bè nào"}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="display">
        {selectedFriend ? (
          <Profile data={selectedFriend} type={type} compact={true} />
        ) : (
          <div className="w-full flex flex-col items-center justify-center text-center">
            <div className="max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center animate-pulse">
                <i className="fa-solid fa-user-group text-4xl text-blue-500"></i>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Chào mừng đến với trang bạn bè
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Chọn một người bạn từ danh sách bên trái để xem thông tin chi tiết, 
                bài viết và ảnh của họ tại đây.
              </p>
              
              
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">Mẹo nhanh:</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2 text-gray-700">
                    <i className="fa-solid fa-check-circle text-green-500 text-sm"></i>
                    <span>Nhấp vào tên bạn bè để xem trang cá nhân</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <i className="fa-solid fa-message text-blue-500 text-sm"></i>
                    <span>Gửi tin nhắn trực tiếp từ trang cá nhân</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <i className="fa-solid fa-user-plus text-purple-500 text-sm"></i>
                    <span>Thêm bạn mới từ gợi ý kết bạn</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => navigate("/friends/suggestion")}
                className="mt-8 px-6! py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg! font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
              >
                <i className="fa-solid fa-compass"></i>
                Khám phá gợi ý kết bạn
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendDetail;