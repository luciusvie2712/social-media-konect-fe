import { useEffect, useState } from "react";
import { useFriendList } from "../../hook/useFriendList";
import { getPostAUser, unFriend } from "../../utils/api.customize";
import avatar from "../../assets/download.png";
import PostActive from "./PostActive";
import FriendActive from "./FriendActive";
import { useFriendActions } from "../../hook/useFriendActions";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../Modal/EditProfile.modal"; // Import component mới

const DisplayProfile = ({ info, mode, relationship = null, isLoadingRelationship = false, onRelationshipUpdate = null, compact = false }) => {
  const { friends, loading: friendsLoading, refetch: refetchFriends } = useFriendList("all", info.id)
  const [dataPost, setDataPost] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [activeTab, setActiveTab] = useState("posts")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [profileInfo, setProfileInfo] = useState(info)
  
  const user = useSelector((state) => state.user.account)
  const navigate = useNavigate()
  
  const {
    status,
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
  } = useFriendActions();

  // Cập nhật thông tin profile khi prop info thay đổi
  useEffect(() => {
    setProfileInfo(info)
  }, [info])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true)
        const res = await getPostAUser(profileInfo.id)
        if (res?.Ec === 0) {
          setDataPost(Array.isArray(res.Data) ? res.Data : [res.Data])
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
        setDataPost([]);
      } finally {
        setLoadingPosts(false)
      }
    };
    
    if (profileInfo?.id) {
      fetchPosts()
    }
  }, [profileInfo?.id])
  
  const getRelationshipStatusText = () => {
    switch (mode) {
      case "owner":
        return "Hồ sơ của bạn"
      case "friend":
        return "Bạn bè"
      case "pending_outgoing":
        return "Đã gửi lời mời kết bạn"
      case "pending_incoming":
        return "Đã nhận lời mời kết bạn"
      case "stranger":
        return "Chưa kết bạn"
      default:
        return ""
    }
  };

  const getRelationshipBadgeColor = () => {
    switch (mode) {
      case "owner":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "friend":
        return "bg-green-100 text-green-800 border border-green-200"
      case "pending_outgoing":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "pending_incoming":
        return "bg-orange-100 text-orange-800 border border-orange-200"
      case "stranger":
        return "bg-gray-100 text-gray-800 border border-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  };

  const getRelationshipIcon = () => {
    switch (mode) {
      case "owner":
        return "fa-user"
      case "friend":
        return "fa-user-check"
      case "pending_outgoing":
        return "fa-clock"
      case "pending_incoming":
        return "fa-user-clock"
      case "stranger":
        return "fa-user"
      default:
        return "fa-user"
    }
  }

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleUpdateSuccess = (updatedData) => {
    setProfileInfo(prev => ({
      ...prev,
      ...updatedData
    }))
    
    if (typeof onRelationshipUpdate === 'function') {
      onRelationshipUpdate(updatedData)
    }
  }

  const handleSendRequest = async () => {
    try {
      setIsProcessing(true)
      const res = await handleSendFriendRequest(user?.id, profileInfo.id)
      if (res?.Ec === 0) {
        toast.success("Đã gửi lời mời kết bạn")
        if (onRelationshipUpdate) {
          onRelationshipUpdate({ 
            status: "pending", 
            requester: user?.id, 
            recipient: profileInfo.id 
          })
        }
      } else {
        toast.error(res?.Mes || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error sending friend request:", error)
      toast.error("Có lỗi xảy ra khi gửi lời mời")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAcceptRequest = async () => {
    try {
      setIsProcessing(true)
      const res = await handleAcceptFriendRequest(relationship?.requester, relationship?.recipient)
      if (res?.Ec === 0) {
        toast.success("Đã chấp nhận lời mời kết bạn")
        if (onRelationshipUpdate) {
          onRelationshipUpdate({ 
            status: "accepted", 
            requester: relationship?.requester, 
            recipient: relationship?.recipient 
          })
        }
        refetchFriends()
      } else {
        toast.error(res?.Mes || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error accepting friend request:", error)
      toast.error("Có lỗi xảy ra khi chấp nhận lời mời")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectRequest = async () => {
    try {
      setIsProcessing(true)
      const res = await handleRejectFriendRequest(relationship?.requester, relationship?.recipient)
      if (res?.Ec === 0) {
        toast.success("Đã từ chối lời mời kết bạn")
        if (onRelationshipUpdate) {
          onRelationshipUpdate({ 
            status: "rejected", 
            requester: relationship?.requester, 
            recipient: relationship?.recipient 
          })
        }
      } else {
        toast.error(res?.Mes || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error)
      toast.error("Có lỗi xảy ra khi từ chối lời mời")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelRequest = async () => {
    try {
      setIsProcessing(true)
      const res = await handleRejectFriendRequest(user?.id, profileInfo.id)
      if (res?.Ec === 0) {
        toast.success("Đã hủy lời mời kết bạn")
        if (onRelationshipUpdate) {
          onRelationshipUpdate(null) // Reset relationship
        }
      } else {
        toast.error(res?.Mes || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error canceling friend request:", error)
      toast.error("Có lỗi xảy ra khi hủy lời mời")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnfriend = async () => {
    try {
      setIsProcessing(true)
      const res = await unFriend(user?.id, profileInfo.id)
      if (res?.Ec === 0) {
        toast.success("Đã hủy kết bạn")
        if (onRelationshipUpdate) {
          onRelationshipUpdate(null) // Reset relationship
        }
        refetchFriends()
      } else {
        toast.error(res?.Mes || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error unfriending:", error)
      toast.error("Có lỗi xảy ra khi hủy kết bạn")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMessage = () => {
    navigate(`/messages/${profileInfo.id}`)
  }

  const handleShareProfile = () => {
    const shareUrl = `${window.location.origin}/profile/${profileInfo.id}`
    if (navigator.share) {
      navigator.share({
        title: `Hồ sơ của ${profileInfo.name}`,
        text: `Xem hồ sơ của ${profileInfo.name}`,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success("Đã sao chép link hồ sơ")
    }
  }

  const renderActionButtons = () => {
    const buttonClass = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (mode) {
      case "owner":
        return (
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleEditProfile}
              className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow`}
            >
              <i className="fa-solid fa-pen"></i>
              Chỉnh sửa hồ sơ
            </button>
            <button 
              onClick={handleShareProfile}
              className={`${buttonClass} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400`}
            >
              <i className="fa-solid fa-share"></i>
              Chia sẻ
            </button>
          </div>
        );
        
      case "friend":
        return (
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleOpenChat}
              className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow`}
            >
              <i className="fa-solid fa-message"></i>
              Nhắn tin
            </button>
            <button 
              onClick={handleUnfriend}
              disabled={isProcessing}
              className={`${buttonClass} bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300`}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-xmark"></i>
                  Hủy kết bạn
                </>
              )}
            </button>
          </div>
        );
        
      case "pending_outgoing":
        return (
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleCancelRequest}
              disabled={isProcessing}
              className={`${buttonClass} bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200`}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-clock"></i>
                  Hủy lời mời
                </>
              )}
            </button>
          </div>
        );
        
      case "pending_incoming":
        return (
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleAcceptRequest}
              disabled={isProcessing}
              className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow`}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  Chấp nhận
                </>
              )}
            </button>
            <button 
              onClick={handleRejectRequest}
              disabled={isProcessing}
              className={`${buttonClass} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400`}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-xmark"></i>
                  Từ chối
                </>
              )}
            </button>
          </div>
        );
        
      case "stranger":
        return (
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleSendRequest}
              disabled={isProcessing}
              className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow`}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Đang gửi...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>
                  Kết bạn
                </>
              )}
            </button>
            <button 
              onClick={handleMessage}
              className={`${buttonClass} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400`}
            >
              <i className="fa-solid fa-message"></i>
              Nhắn tin
            </button>
          </div>
        );
        
      default:
        return null
    }
  }

  const renderTabContent = () => {
    if (activeTab === "posts") {
        return <PostActive userData={profileInfo} friends={friends} posts={dataPost} loadingPosts={loadingPosts} mode={mode} />
    } else {
      return <FriendActive friends={friends} loading={friendsLoading} />
    }
  }

  const handleOpenChat = () => {
    const event = new CustomEvent('openMiniChat', {
      detail: {
        friendId: profileInfo.id || profileInfo._id,
        friendData: profileInfo
      }
    })
    window.dispatchEvent(event)
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        {/* Profile header */}
        <div className="w-full bg-white shadow-sm">
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
            <div className="w-full h-64 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              {profileInfo?.background ? (
                <img 
                  src={profileInfo.background} 
                  alt="Cover" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                  <i className="fa-solid fa-images text-4xl text-white/70 mb-2"></i>
                  <span className="text-white/80 italic text-sm">Chưa có ảnh bìa</span>
                </div>
              )}
            </div>
            
            <div className="w-full px-1 lg:px-6!">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-10 py-4">
                <div className="flex gap-4 items-center">
                  <div className=" w-20! h-20 xl:w-32! xl:h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                    <img 
                      src={profileInfo?.avatar || avatar} 
                      alt={profileInfo?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2 justify-center">
                    <div className="flex items-center gap-3">
                      <span className="text-lg xl:text-3xl font-bold text-gray-900">{profileInfo?.name || "Chưa có tên"}</span>
                      {!isLoadingRelationship && (
                        <span className={`hidden xl:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRelationshipBadgeColor()}`}>
                          <i className={`fa-solid ${getRelationshipIcon()} mr-2!`}></i>
                          {getRelationshipStatusText()}
                        </span>
                      )}
                    </div>
                    
                    {profileInfo?.email && (
                      <span className="text-gray-600 text-sm flex items-center gap-1.5">
                        <i className="fa-solid fa-envelope text-gray-400"></i>
                        {profileInfo.email}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-newspaper text-gray-400"></i>
                        <span className="font-medium">{dataPost.length}</span> bài viết
                      </span>
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-user-group text-gray-400"></i>
                        <span className="font-medium">{friends?.length || 0}</span> bạn bè
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  {renderActionButtons()}
                </div>
              </div>
            </div>
            
            {/* Tabs navigation */}
            <div className="w-full border-t border-gray-200 mt-2 px-1 lg:px-6!">
              <div className="w-full flex justify-start gap-3">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium transition-colors ${
                    activeTab === "posts" 
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <i className="fa-solid fa-newspaper"></i>
                  Bài viết
                  {dataPost?.length > 0 && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-1.5! py-0.5! rounded-full">
                      {dataPost.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab("friends")}
                  className={`flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium transition-colors ${
                    activeTab === "friends" 
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                >
                  <i className="fa-solid fa-user-group"></i>
                  Bạn bè
                  {friends?.length > 0 && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-1.5! py-0.5! rounded-full">
                      {friends.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="w-full flex justify-center py-4 flex-1">
          <div className={`${compact ? "w-full" : "w-full 2xl:w-[80%]"} flex`}>
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa hồ sơ */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userInfo={profileInfo}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default DisplayProfile;