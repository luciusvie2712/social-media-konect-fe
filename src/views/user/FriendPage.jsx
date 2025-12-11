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
          <div className="w-full min-h-[200px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        ) : safeRequest.length > 0 ? (
          <ShowGridFriend data={safeRequest} type="request" />
        ) : (
          <div className="w-full min-h-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">Không có lời mời kết bạn</p>
              <p className="text-gray-400 mt-2">Khi có ai đó gửi lời mời, bạn sẽ thấy chúng ở đây.</p>
            </div>
          </div>
        )}
        
        <hr className="my-8" />
        
        <div className="title">
          <p>Gợi ý kết bạn</p>
        </div>
        {loadingSuggestion ? (
          <div className="w-full min-h-[200px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        ) : safeSuggestion.length > 0 ? (
          <ShowGridFriend data={safeSuggestion} type="suggestion" />
        ) : (
          <div className="w-full min-h-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.281.384-.612.748-.991 1.087a6 6 0 01-8.71 0 13.96 13.96 0 01-.991-1.087" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">Không có gợi ý kết bạn</p>
              <p className="text-gray-400 mt-2">Hãy kết nối với nhiều người hơn để nhận gợi ý.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendPage;