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
            <span>Loading ... </span>
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
            <span>Không có dữ liệu</span>
          )}
        </div>
      </div>
      <div className="display">
        {selectedFriend ? (
          <Profile data={selectedFriend} type={type}/>
        ) : (
          <span>
            Vui lòng chọn bạn bè bạn muốn xem trang cá nhân
          </span>
        )}
      </div>
    </div>
  );
};

export default FriendDetail;
