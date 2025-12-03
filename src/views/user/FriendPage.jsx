import NavBar from "../../components/Friends/NavBar";
import ShowGridFriend from "../../components/Friends/ShowGridFriend";
import "../../styles/FriendPage.scss";
import { useSelector } from "react-redux";
import { useFriendList } from "../../hook/useFriendList";

const FriendPage = () => {
  const user = useSelector((state) => state.user.account)

  const { friends: friendRequest, loading: loadingRequest } = useFriendList("request", user?.id)
  const { friends: friendSuggestion, loading: loadingSuggestion } = useFriendList("suggestion", user?.id)
  const safeRequest = Array.isArray(friendRequest) ? friendRequest : [];
  const safeSuggestion = Array.isArray(friendSuggestion) ? friendSuggestion : []; 

  return (
    <div className="friend-container">
      <div className="navbar-left">
        <NavBar />
      </div>
      <div className="display-content">
        <div className="title">
          <p>Lời mời kết bạn</p>
        </div>
        {loadingRequest ?  (
          <span>Loading ... </span>
        ) : (
          <ShowGridFriend data={safeRequest} type="request" />
        )}
        <hr />
        <div className="title">
          <p>Gợi ý kết bạn</p>
        </div>
        {loadingSuggestion ? (
          <span>Loading ...</span>
        ) : (
          <ShowGridFriend data={safeSuggestion} type="suggestion" />
        )}
      </div>
    </div>
  );
};

export default FriendPage;
