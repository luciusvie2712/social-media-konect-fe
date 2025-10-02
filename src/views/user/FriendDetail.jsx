import { useNavigate, useParams } from "react-router-dom";
import ShowListFriends from "../../components/Friends/ShowListFriends";
import "../../styles/FriendDetail.scss";
import { useEffect, useState } from "react";
import Profile from "../../components/Profile/Profile";
import { useSelector } from "react-redux";
import { getFriendRequest } from "../../utils/api.customize";

const FriendDetail = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [ friendRequest, setFriendRequest ] = useState([])
  const [selectedFriend, setSelectedFriend] = useState(null);
  const user = useSelector((state) => state.user.account)

  const handleGetFriendRequest = async () => {
    try {
      const dataRequest = await getFriendRequest(user?.id)
      if (dataRequest.Ec === 0) {
        setFriendRequest(dataRequest.data)
      } else {
        console.log(dataRequest?.Mes)
      }
    } catch (error) {
      console.log(">>> Loi cmnr: ", error)
    }
  }
  console.log(">>>", friendRequest)

  useEffect(() => {
    if (user.id) {
      handleGetFriendRequest()
    }
  }, [])


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
            ? friendRequest.map((item, index) => (
                <ShowListFriends
                  typeList={type}
                  key={index}
                  item={item}
                  onSelect={() => setSelectedFriend(item)}
                />
              ))
            : friendRequest.map((item, index) => (
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
