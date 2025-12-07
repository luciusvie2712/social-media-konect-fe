import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  deletePost,
  handleReportPost,
  LikePost,
  sharePost,
} from "../../utils/api.customize";
import avatar from "../../assets/download.png";
import { useComment } from "../../hook/useComment";
import CommentItem from "./CommentItem";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { timeAgo } from "../../utils/timeAgo";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalSharePost from "../Modal/ModalSharePost";
import Caption from "./Caption";

const PostCard = ({ post, index, onDeletePost }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [openComment, setOpenComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [timeText, setTimeText] = useState(timeAgo(post.createdAt));
  const [reasonReport, setReasonReport] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [shareModalShow, setShareModalShow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  console.log("Bai Viet: ", post)

  // Kiểm tra xem đây có phải là bài viết share không
  const isSharedPost = post?.sharedPost;
  const originalPost = isSharedPost ? post.sharedPost : post;

  // Xử lý media cho bài viết gốc hoặc bài viết share
  const mediaList = Array.isArray(originalPost?.media)
    ? originalPost.media.filter((m) => m?.url)
    : [];

  const user = useSelector((state) => state.user.account);
  const userId = user?.id;

  const {
    comments,
    loading: commentsLoading,
    fetchComments,
    handleCreateComment,
    handleDeleteComment,
  } = useComment();

  const REPORT_REASONS = [
    "Nội dung phản cảm hoặc không phù hợp",
    "Spam, quảng cáo hoặc lừa đảo",
    "Ngôn từ kích động thù hận",
    "Thông tin sai sự thật",
    "Bạo lực, đe dọa hoặc làm hại người khác",
    "Quấy rối hoặc bắt nạt",
    "Chia sẻ thông tin cá nhân không cho phép",
    "Nội dung nhạy cảm (18+)",
    "Vi phạm bản quyền",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeText(timeAgo(post.createdAt));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [post.createdAt]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Khởi tạo like state
  useEffect(() => {
    if (post && userId) {
      const liked = post.likes?.some(like => 
        typeof like === 'string' ? like === userId : like._id === userId
      );
      setIsLiked(liked);
      setLikeCount(post.likes?.length || 0);
      setCommentCount(post.comments?.length || 0);
    }
  }, [post, userId]);

  const handleDeletePost = async (postId) => {
    try {
      const res = await deletePost(postId);
      if (res?.Ec === 0) {
        toast.success("Đã gỡ bỏ bài viết");
        if (onDeletePost) onDeletePost(postId);
      } else {
        toast.warn(res?.Mes || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Delete error: ", error);
      toast.error("Không thể xóa bài viết");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await LikePost(userId, postId);
      if (response?.Ec === 0) {
        const newLiked = !isLiked;
        setIsLiked(newLiked);
        setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
      } else {
        toast.error(response?.Mes || "Không thể thích bài viết");
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const renderMedia = () => {
    if (mediaList.length === 0) return null;

    if (mediaList[0]?.type === "video") {
      const video = mediaList[0];
      return (
        <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video group">
          <video
            src={video.url}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            controls
            poster={video.thumbnail}
          />
          <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
            <i className="fas fa-play mr-1"></i> Video
          </div>
        </div>
      );
    }

    if (mediaList.length === 1) {
      return (
        <div className="w-full overflow-hidden flex rounded-xl">
          <div className="w-full flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={mediaList[0].url}
              alt="Media"
              className="object-contain max-w-full max-h-[600px] rounded-xl hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
        </div>
      );
    }

    const displayImageList = mediaList.slice(0, 9);
    const hiddenCount = mediaList.length - 9;
    
    const getGridClass = () => {
      switch (displayImageList.length) {
        case 2: return "grid-cols-2";
        case 3: return "grid-cols-2 md:grid-cols-3";
        case 4: return "grid-cols-2";
        default: return "grid-cols-2 md:grid-cols-3";
      }
    };

    return (
      <div className={`grid ${getGridClass()} gap-2 overflow-hidden rounded-xl`}>
        {displayImageList.map((media, index) => (
          <div 
            key={index} 
            className="relative aspect-square overflow-hidden rounded-xl group"
          >
            <img
              src={media.url}
              alt=""
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {index === 8 && hiddenCount > 0 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-white text-3xl font-bold">+{hiddenCount}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleOpenComment = () => {
    if (openComment) {
      setOpenComment(false);
    } else {
      setOpenComment(true);
      fetchComments(post._id);
    }
  };

  const onCreateComment = async (content, parentComment = null) => {
    const success = await handleCreateComment({
      post: post._id,
      author: userId,
      content,
      parentComment,
    });
    if (success) {
      await fetchComments(post._id);
      setNewComment("");
      setCommentCount(prev => prev + 1);
    }
  };

  const onDeleteComment = async (commentId) => {
    const success = await handleDeleteComment(commentId, userId);
    if (success) {
      await fetchComments(post._id);
      setCommentCount(prev => prev - 1);
    }
  };

  const handleReport = async () => {
    const response = await handleReportPost(post._id, userId, reasonReport);
    if (response?.Ec === 0) {
      setReasonReport("");
      setShowReportModal(false);
      toast.success("Báo cáo bài viết thành công");
    } else {
      toast.warning(response?.Mes || "Có lỗi xảy ra");
    }
  };

  const renderSharedPost = () => {
    if (!isSharedPost) return null;
    
    const sharedMedia = Array.isArray(post.sharedPost?.media) 
      ? post.sharedPost.media[0] 
      : post.sharedPost?.media;

    return (
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors my-3">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.sharedPost?.author?.avatar || avatar}
            alt={post.sharedPost?.author?.name}
            className="rounded-full w-8 h-8 object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">
              {post.sharedPost?.author?.name || "Ẩn danh"}
            </div>
            <div className="text-xs text-gray-500">
              {timeAgo(post.sharedPost?.createdAt)}
            </div>
          </div>
        </div>
        
        {/* Caption của bài gốc */}
        {post.sharedPost?.caption && (
          <div className="text-gray-700 mb-3 text-sm">
            {post.sharedPost.caption.length > 150
              ? post.sharedPost.caption.substring(0, 150) + "..."
              : post.sharedPost.caption}
          </div>
        )}
        
        {/* Media của bài gốc */}
        {sharedMedia?.url && (
          <div className="rounded-lg overflow-hidden">
            {sharedMedia.type === "video" ? (
              <div className="relative aspect-video bg-black">
                <video
                  src={sharedMedia.url}
                  className="w-full h-full object-cover"
                  poster={sharedMedia.thumbnail}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                    <i className="fas fa-play text-white"></i>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={sharedMedia.url}
                alt=""
                className="w-full h-40 object-cover"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const renderVisibilityIcon = () => {
    const visibility = post.visibility || 'public';
    const icons = {
      private: { icon: "fa-lock", text: "Chỉ mình tôi" },
      friends: { icon: "fa-user-group", text: "Bạn bè" },
      public: { icon: "fa-earth-europe", text: "Công khai" }
    };
    
    const { icon, text } = icons[visibility];
    return (
      <div className="flex items-center gap-1" title={text}>
        <i className={`fa-solid ${icon} opacity-60 text-xs`}></i>
      </div>
    );
  };

  const getLikeButtonClass = () => 
    `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
      isLiked 
        ? 'bg-red-50 text-red-500 hover:bg-red-100' 
        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
    }`;

  const getActionButtonClass = () => 
    'flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-300';

  return (
    <>
      <div
        key={index}
        className="w-full rounded-2xl bg-white px-4 py-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 mb-6"
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1">
            <NavLink
              to={`/profile/${post.author?._id}`}
              className="flex-shrink-0"
            >
              <div className="relative">
                <img
                  src={post.author?.avatar || avatar}
                  alt={post.author?.name}
                  className="rounded-full w-12 h-12 object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </NavLink>
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <NavLink
                  to={`/profile/${post.author?._id}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors !no-underline truncate"
                >
                  {post.author?.name}
                </NavLink>
                {post.author?.verified && (
                  <i className="fas fa-check-circle text-blue-500 text-sm"></i>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{timeText}</span>
                <span className="text-gray-300">•</span>
                {renderVisibilityIcon()}
                
                {/* Hiển thị nếu là bài viết share */}
                {isSharedPost && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 text-blue-600">
                      <i className="fas fa-share text-xs"></i>
                      <span className="text-xs">Đã chia sẻ</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-ellipsis-h text-gray-500"></i>
            </button>
            
            {openMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10">
                {post.author?._id === userId ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post._id);
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <i className="fas fa-trash text-sm"></i>
                      <span>Gỡ bài viết</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <i className="fas fa-edit text-sm"></i>
                      <span>Chỉnh sửa</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <i className="fas fa-flag text-sm"></i>
                    <span>Báo cáo bài viết</span>
                  </button>
                )}
                
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <i className="fas fa-bookmark text-sm"></i>
                  <span>Lưu bài viết</span>
                </button>
                
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <i className="fas fa-link text-sm"></i>
                  <span>Sao chép liên kết</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Caption của bài viết hiện tại */}
        {post.caption && (
          <div className="mb-4">
            <div className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">
              {post.caption.length > 300 && !isExpanded ? (
                <>
                  <Caption caption={post.caption.substring(0, 300) + "..."} />
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm ml-1"
                  >
                    Xem thêm
                  </button>
                </>
              ) : (
                <>
                  <Caption caption={post.caption} />
                  {post.caption.length > 300 && (
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm ml-1"
                    >
                      Thu gọn
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Hiển thị bài viết được share */}
        {renderSharedPost()}

        {/* Media của bài viết hiện tại (nếu không phải share) */}
        {!isSharedPost && mediaList.length > 0 && (
          <div className="mb-4">
            {renderMedia()}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3 px-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  <i className="fas fa-heart"></i>
                </div>
              </div>
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="far fa-comment"></i>
              <span>{commentCount} bình luận</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fas fa-share"></i>
              <span>{post.shareCount || 0} chia sẻ</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-b border-gray-100 py-2 mb-3">
          <button
            onClick={() => handleLikePost(post._id)}
            className={getLikeButtonClass()}
          >
            <i className={`fa-${isLiked ? "solid" : "regular"} fa-heart text-lg`}></i>
            <span className="font-medium">
              {isLiked ? "Đã thích" : "Thích"}
            </span>
          </button>
          
          <button
            onClick={handleOpenComment}
            className={getActionButtonClass()}
          >
            <i className="far fa-comment text-lg"></i>
            <span className="font-medium">Bình luận</span>
          </button>
          
          <button
            onClick={() => setShareModalShow(true)}
            className={getActionButtonClass()}
          >
            <i className="fas fa-share text-lg"></i>
            <span className="font-medium">Chia sẻ</span>
          </button>
        </div>

        {/* Comment Section */}
        {openComment && (
          <div className="w-full">
            {/* Comment Input */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user?.avatar || avatar}
                alt="Avatar"
                className="rounded-full w-8 h-8 object-cover"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onCreateComment(newComment)}
                  placeholder="Viết bình luận..."
                  className="w-full px-4 py-2 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={() => onCreateComment(newComment)}
                  disabled={!newComment.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {commentsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : comments?.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    userId={userId}
                    onReply={onCreateComment}
                    onDelete={onDeleteComment}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <i className="far fa-comment-dots text-3xl mb-2"></i>
                  <p>Hãy là người đầu tiên bình luận</p>
                </div>
              )}
            </div>

            {/* View All Comments */}
            {comments?.length > 3 && (
              <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2 mt-2">
                Xem tất cả bình luận ({comments.length})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Modal 
        show={showReportModal} 
        onHide={() => setShowReportModal(false)} 
        backdrop="static"
        centered
      >
        <Modal.Header className="border-b-0">
          <Modal.Title className="w-full text-center text-xl font-bold">
            <i className="fas fa-flag text-red-500 mr-2"></i>
            Báo cáo bài viết
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="py-0">
          <p className="text-gray-600 mb-4">
            Hãy chọn lý do bạn muốn báo cáo bài viết này:
          </p>
          
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {REPORT_REASONS.map((reason, index) => (
              <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  id={`reason-${index}`}
                  checked={reasonReport === reason}
                  onChange={(e) => setReasonReport(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label
                  htmlFor={`reason-${index}`}
                  className="ml-3 text-gray-700 cursor-pointer flex-1"
                >
                  {reason}
                </label>
              </div>
            ))}
          </div>
        </Modal.Body>
        
        <Modal.Footer className="border-t-0 pt-0">
          <Button
            variant="light"
            onClick={() => setShowReportModal(false)}
            className="px-6 py-2"
          >
            Hủy
          </Button>
          <Button
            onClick={handleReport}
            disabled={!reasonReport}
            className="px-6 py-2 bg-red-600 border-red-600 hover:bg-red-700"
          >
            <i className="fas fa-paper-plane mr-2"></i>
            Gửi báo cáo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Share Modal */}
      <ModalSharePost
        shareContent={post}
        shareModalShow={shareModalShow}
        setShareModalShow={setShareModalShow}
        setShareContent={() => {}}
        userId={userId}
      />
    </>
  );
};

export default PostCard;