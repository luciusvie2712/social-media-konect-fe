import { useNavigate, useParams } from "react-router-dom";
import ShowListFriends from "../../components/Friends/ShowListFriends";
import "../../styles/FriendDetail.scss";
import { friendRequest } from "../../assets/fake.data";
import { useState } from "react";
import Profile from "../../components/Profile/Profile";

const FriendDetail = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const dataFriends = friendRequest;
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="container">
      <div className="nav-left">
        <div className="header-nav">
          <div onClick={() => navigate(-1)} className="btn-back">
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          {type === "request" ? (
            <span>Lời mời kết bạn</span>
          ) : (
            <span>Gợi ý kết bạn</span>
          )}
        </div>
        <div className="show-list">
          {type === "request"
            ? dataFriends.map((item, index) => (
                <ShowListFriends
                  typeList={type}
                  key={index}
                  item={item}
                  onSelect={() => setSelectedFriend(item)}
                />
              ))
            : dataFriends.map((item, index) => (
                <ShowListFriends
                  typeList={type}
                  key={index}
                  item={item}
                  onSelect={() => setSelectedFriend(item)}
                />
              ))}
        </div>
      </div>
      <div className="display">
        {selectedFriend ? (
          <Profile data={selectedFriend} typeProfile={type} />
        ) : (
          <span className="">
            Vui long chon nguoi ban muon xem truoc trang ca nhan
          </span>
        )}
      </div>
    </div>
  );
};

export default FriendDetail;
