import { useNavigate, useParams } from "react-router-dom";
import ShowListFriends from "../../components/Friends/ShowListFriends";
import "../../styles/FriendDetail.scss";
import { useState } from "react";
import Profile from "../user/ProfilePage";
import { useSelector } from "react-redux";
import { useFriendList } from "../../hook/useFriendList";

const FriendDetail = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const user = useSelector((state) => state.user.account);

  const { friends, loading } = useFriendList(type, user?.id);
  console.log(friends);
  return (
    <div className="container">
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
                onSelect={() => setSelectedFriend(item)}
              />
            ))
          ) : (
            <span>Không có dữ liệu</span>
          )}
        </div>
      </div>
      <div className="display">
        {selectedFriend ? (
          <Profile data={selectedFriend} typeProfile={type} />
        ) : (
          <span className="">
            Vui lòng chọn bạn bè bạn muốn xem trang cá nhân
          </span>
        )}
      </div>
    </div>
  );
};

export default FriendDetail;
