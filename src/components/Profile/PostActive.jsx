import { useEffect, useState } from "react"
import { getPostAUser } from "../../utils/api.customize"
import PostCard from "../Post/PostCard"
import avatar from "../../assets/download.png"
import { Link, useNavigate } from "react-router-dom"
import CreatePostModal from "../Modal/createPost.modal"

const PostActive = ({ userData, friends, posts, loadingPosts = false, mode = "stranger" }) => { 
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const navigate = useNavigate()

  const renderGenderUser = () => {
    if (userData.gender === "Male") return <span className="text-gray-900 font-medium text-sm">Nam</span>
    if (userData.gender === "Female") return <span className="text-gray-900 font-medium text-sm">Nữ</span>
    else return <span className="text-gray-900 font-medium text-sm">Khác</span>
  }
  const renderIconGenderUser = () => {
    if (userData.gender === "Male") return <i className="fa-solid fa-mars text-gray-700 text-xs"></i>
    if (userData.gender === "Female") return <i className="fa-solid fa-venus text-gray-700 text-xs"></i>
    else return <i className="fa-solid fa-genderless text-gray-700 text-xs"></i>
  } 


  return (
    <>
      <div className="w-full flex flex-col xl:flex-row items-start gap-3 lg:gap-4 px-2 lg:px-4">
        {/* Left sidebar - About & Friends */}
        <div className="w-full xl:w-[40%] flex flex-col gap-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full py-3">
            <div className="px-3 pb-2 border-b border-gray-100 w-full">
              <span className="font-bold text-gray-900 text-[16px] lg:text-[17px] flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-blue-500 text-sm"></i>
                Giới thiệu
              </span>
            </div>
            <div className="w-full flex flex-col justify-center">
              {userData.bio && (
                <div className="mb-1 pb-3 border-b border-gray-100 w-full flex justify-center">
                  <p className="text-gray-700 text-sm">{userData.bio}</p>
                </div>
              )}
              <div className="w-full flex flex-col px-3 gap-2">
                {userData.work && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fa-solid fa-briefcase text-gray-700 text-xs"></i>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-700 text-sm">Làm việc</span>
                      <span className="text-gray-900 font-medium text-sm">{userData.work}</span>
                    </div>
                  </div>
                )}
                
                {userData.address && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fa-solid fa-location-dot text-gray-700 text-xs"></i>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-700 text-sm">Sống tại</span>
                      <span className="text-gray-900 font-medium text-sm">{userData.address}</span>
                    </div>
                  </div>
                )}
                
                {userData.education && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fa-solid fa-graduation-cap text-gray-700 text-xs"></i>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-700 text-sm">Học vấn</span>
                      <span className="text-gray-900 font-medium text-sm">{userData.education}</span>
                    </div>
                  </div>
                )}

                {userData.gender && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {renderIconGenderUser()}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-700 text-sm">Giới tính</span>
                      {renderGenderUser()}
                    </div>
                  </div>
                )}
                {userData.website && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fa-solid fa-link text-gray-700 text-xs"></i>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link to={userData.website} className="text-gray-900 font-medium text-sm">{userData.website}</Link>
                    </div>
                  </div>
                )}          
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-900 text-[16px] lg:text-[17px] flex items-center gap-2">
                <i className="fa-solid fa-user-group text-blue-600 text-sm"></i>
                Bạn bè
                {friends?.length > 0 && (
                  <span className="text-gray-500 text-xs font-normal ml-1">({friends.length})</span>
                )}
              </span>
              {friends?.length > 0 && (
                <button className="text-blue-600 hover:text-blue-700 text-[15px]! font-medium">
                  Xem tất cả
                </button>
              )}
            </div>
            <div className="px-4 py-2">
              {!friends || friends.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                    <i className="fa-solid fa-user-group text-gray-400"></i>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Chưa có bạn bè</p>
                  <p className="text-gray-500 text-xs mt-1">Khi có bạn bè, họ sẽ xuất hiện ở đây</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {friends.slice(0, 6).map((friend, index) => (
                      <div 
                        key={friend._id || index} 
                        onClick={() => navigate(`/profile/${friend._id}`)}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className="w-full aspect-square rounded-md overflow-hidden mb-1 border border-gray-200 group-hover:border-blue-300 transition-colors">
                          <img 
                            src={friend.avatar || avatar} 
                            alt={friend.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <p className="text-xs font-medium text-gray-900 text-center truncate w-full px-1">
                          {friend.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full xl:w-[60%] flex flex-col gap-3">
          {mode === "owner" && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-3">
              <div className="flex items-center gap-3 px-4">
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <img 
                    src={userData.avatar || avatar} 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => setIsCreateOpen(true)}
                  className="flex-1 text-left px-2 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 text-sm"
                >
                  Bạn đang nghĩ gì?
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                <button 
                  onClick={() => setIsCreateOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-1 text-gray-600 hover:bg-gray-50 transition-colors text-[14px]!"
                >
                  <i className="fa-solid fa-image text-green-500"></i>
                  Ảnh/Video
                </button>
                <button 
                  onClick={() => setIsCreateOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-1 text-gray-600 hover:bg-gray-50 transition-colors text-[14px]!"
                >
                  <i className="fa-solid fa-user-tag text-blue-500"></i>
                  Gắn thẻ bạn bè
                </button>
                <button 
                  onClick={() => setIsCreateOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-1 text-gray-600 hover:bg-gray-50 transition-colors text-[14px]!"
                >
                  <i className="fa-solid fa-face-smile text-yellow-500"></i>
                  Cảm xúc
                </button>
              </div>
            </div>
          )}
          
          <div className="w-full flex flex-col gap-1">
            <div className="px-4 py-1 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-[16px] lg:text-[17px] flex items-center gap-2">
                <i className="fa-solid fa-newspaper text-purple-500 text-sm"></i>
                Bài viết
                {posts?.length > 0 && (
                  <span className="text-gray-500 text-xs font-normal ml-1">({posts.length})</span>
                )}
              </span>
            </div>
            
            <div className="p-1">
              {loadingPosts ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-xs">Đang tải bài viết...</p>
                  </div>
                </div>
              ) : !posts || posts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <i className="fa-regular fa-newspaper text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-600 font-medium text-sm">Chưa có bài viết nào</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {mode === "owner" 
                      ? "Hãy tạo bài viết đầu tiên của bạn!" 
                      : "Người dùng này chưa có bài viết nào"}
                  </p>
                  {mode === "owner" && (
                    <button 
                      onClick={() => setIsCreateOpen(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-2 mx-auto"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                      Tạo bài viết đầu tiên
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {posts.map((post, index) => (
                    <PostCard 
                      key={post._id || index} 
                      post={post} 
                      index={index}
                    />
                  ))}
                  
                  {posts.length > 5 && (
                    <div className="pt-3 mt-1 border-t border-gray-100 flex justify-center">
                      <button className="px-4 py-1.5 text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1">
                        <i className="fa-solid fa-chevron-down text-[10px]"></i>
                        Xem thêm bài viết
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCreateOpen && (
        <CreatePostModal 
          isOpen={isCreateOpen}
          setIsOpen={setIsCreateOpen}
          account={userData}
        />
      )}
    </>
  )
}

export default PostActive