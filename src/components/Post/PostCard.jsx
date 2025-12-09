import { use, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import {
  getPostById,
  handleReportPost,
  LikePost,
  authorDeletePost,
  sharePost,
} from "../../utils/api.customize";
import avatar from "../../assets/download.png";
import { useComment } from "../../hook/useComment";
import CommentItem from "./CommentItem";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { timeAgo } from "../../utils/timeAgo";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalSharePost from "../Modal/ModalSharePost";
import Caption from "./Caption";
import ModalEditPost from "../Modal/editPost.modal";

const PostCard = ({ post, index, onUpdatePost }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [statusLike, setStatusLike] = useState({});
  const [openComment, setOpenComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [timeText, setTimeText] = useState(timeAgo(post.createdAt));
  const [reasonReport, setReasonReport] = useState("");
  const [dataPost, setDataPost] = useState([]);
  const [show, setShow] = useState(false);
  const [postIdReport, setPostIdReport] = useState();
  const [shareContent, setShareContent] = useState("");
  const [shareModalShow, setShareModalShow] = useState(false);
  const [sharedPostData, setSharedPostData] = useState(null);
  const [loadingSharedPost, setLoadingSharedPost] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate()
  
  // Check if this is a shared post
  const isSharedPost = post?.sharedPost;
  
  const mediaList = Array.isArray(post?.media)
    ? post.media.filter((m) => m?.url)
    : post?.media?.url
    ? [post.media]
    : [];
    
  const user = useSelector((state) => state.user.account);
  const userId = user?.id;
  
  const {
    comments,
    loading,
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

  // Chỉ lấy tối đa 4 comments để hiển thị
  const displayedComments = comments.slice(0, 4);
  const hasMoreComments = comments.length > 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeText(timeAgo(post.createdAt));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [post.createdAt]);

  useEffect(() => {
    const hanldeClickOutSide = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", hanldeClickOutSide);
    return () => document.removeEventListener("mousedown", hanldeClickOutSide);
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      const res = await authorDeletePost(postId);
      console.log("Xoas baif viet ")
      if (res?.Ec === 0) {
        toast.success("Đã gỡ bỏ bài viết");
      } else toast.warn(res?.Mes);
    } catch (error) {
      console.error("Delete error: ", error);
    }
  };

  useEffect(() => {
    if (post) {
      const postArray = Array.isArray(post) ? post : [post];
      setDataPost(postArray);
      syncLikesStatus(postArray);
    }
  }, [post, userId]);

  const syncLikesStatus = (posts) => {
    const status = {};
    posts.forEach((item) => {
      status[item._id] = item.likes.some((like) => {
        if (typeof like === "string") return like === userId;
        if (typeof like === "object" && like._id) return like._id === userId;
        return false;
      });
    });
    setStatusLike(status);
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await LikePost(userId, postId);
      if (response?.Ec === 0) {
        setStatusLike((prev) => ({
          ...prev,
          [postId]: !prev[postId],
        }));
        setDataPost((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              const alreadyLiked = post.likes.some((like) => {
                if (typeof like === "string") return like === userId;
                if (typeof like === "object" && like._id)
                  return like._id === userId;
                return false;
              });

              const updateLikes = alreadyLiked
                ? post.likes.filter((like) => {
                    if (typeof like === "string") return like !== userId;
                    if (typeof like === "object" && like._id)
                      return like._id !== userId;
                    return true;
                  })
                : [...post.likes, userId];
              return { ...post, likes: updateLikes };
            }
            return post;
          })
        );
      } else {
        toast.error(response?.Mes);
      }
    } catch (e) {
      console.error("Lỗi like:", error);
    }
  };

  // Fetch shared post data
  useEffect(() => {
    const fetchSharedPost = async () => {
      if (!post?.sharedPost) return;

      try {
        setLoadingSharedPost(true);
        const res = await getPostById(post.sharedPost);
        if (res?.Ec === 0 && res?.Data) {
          setSharedPostData(res.Data);
        }
      } catch (error) {
        console.error("Error fetching shared post:", error);
      } finally {
        setLoadingSharedPost(false);
      }
    };

    if (isSharedPost) {
      fetchSharedPost();
    }
  }, [post.sharedPost, isSharedPost]);

  const renderMedia = () => {
    if (mediaList[0]?.type === "video") {
      const video = mediaList[0];
      return (
        <div className="relative w-full rounded overflow-hidden bg-black aspect-video">
          <video
            onClick={() => navigate(`/post/${post._id}`)}
            src={video.url}
            className="w-full h-full object-cover"
            controls
          />
        </div>
      );
    }

    if (mediaList.length === 1) {
      return (
        <div className="w-full overflow-hidden flex">
          <div className="w-full flex justify-center bg-[#e5e5e5]">
            <img
              onClick={() => navigate(`/post/${post._id}`)}
              src={mediaList[0].url}
              className="object-contain max-w-full max-h-[600px]"
              alt="post media"
            />
          </div>
        </div>
      );
    }
    const displayImageList = mediaList.slice(0, 9);
    const hiddenCount = mediaList.length - 9;
    return (
      <div
        onClick={() => navigate(`/post/${post._id}`)}
        className={`grid ${
          displayImageList.length === 2
            ? "grid-cols-2"
            : displayImageList.length === 3
            ? "grid-cols-3"
            : "grid-cols-3"
        } gap-1 overflow-hidden`}
      >
        {displayImageList.map((media, index) => (
          <div key={index} className="relative aspect-square overflow-hidden">
            <img
              src={media.url}
              alt=""
              className="w-full h-full rounded object-cover"
            />
            {index === 8 && hiddenCount > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
                +{hiddenCount}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render shared post content
  const renderSharedPost = () => {
    if (!isSharedPost || !sharedPostData) return null;

    const sharedMediaList = Array.isArray(sharedPostData?.media)
      ? sharedPostData.media.filter((m) => m?.url)
      : sharedPostData?.media?.url
      ? [sharedPostData.media]
      : [];

    const sharedCaption = sharedPostData?.caption || "";
    const sharedAuthor = sharedPostData?.author;

    return (
      <div className="w-full mt-3 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
        {/* Shared post header */}
        <div className="px-3 py-2 border-b border-gray-200 bg-gray-100">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-share text-blue-500"></i>
            <span className="text-sm font-medium text-gray-700">
              {dataPost[0]?.author?.name} đã chia sẻ bài viết từ{" "}
              {sharedAuthor?._id === userId ? "bạn" : sharedAuthor?.name}
            </span>
          </div>
        </div>

        {/* Shared post content */}
        <div className="p-3">
          {/* Shared post author info */}
          <div className="flex items-center gap-2 mb-2">
            <NavLink
              to={`/profile/${sharedAuthor?._id}`}
              className="flex justify-center items-center"
            >
              <img
                src={sharedAuthor?.avatar || avatar}
                className="rounded-full w-8 h-8"
                alt="author avatar"
              />
            </NavLink>
            <div>
              <NavLink
                to={`/profile/${sharedAuthor?._id}`}
                className="font-semibold text-black !no-underline text-sm hover:underline"
              >
                {sharedAuthor?.name}
              </NavLink>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">
                  {timeAgo(sharedPostData.createdAt)}
                </span>
                {sharedPostData?.visibility === "private" && (
                  <i className="fa-solid fa-lock text-gray-500 text-[10px]"></i>
                )}
                {sharedPostData?.visibility === "friends" && (
                  <i className="fa-solid fa-user-group text-gray-500 text-[10px]"></i>
                )}
                {sharedPostData?.visibility === "public" && (
                  <i className="fa-solid fa-earth-europe text-gray-500 text-[10px]"></i>
                )}
              </div>
            </div>
          </div>

          {sharedCaption && (
            <div className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
              <Caption caption={sharedCaption} />
            </div>
          )}

          {sharedMediaList.length > 0 && (
            <div className="mt-2 rounded overflow-hidden border border-gray-200">
              {sharedMediaList.length === 1 && sharedMediaList[0]?.type === "video" ? (
                <div className="relative w-full bg-black aspect-video">
                  <video
                    src={sharedMediaList[0].url}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-play text-white text-3xl bg-black/30 rounded-full p-3"></i>
                  </div>
                </div>
              ) : sharedMediaList.length === 1 ? (
                <div className="w-full flex justify-center bg-gray-100">
                  <img
                    src={sharedMediaList[0].url}
                    className="object-contain max-h-48"
                    alt="shared media"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1">
                  {sharedMediaList.slice(0, 4).map((media, index) => (
                    <div key={index} className="aspect-square overflow-hidden">
                      <img
                        src={media.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {index === 3 && sharedMediaList.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold">
                          +{sharedMediaList.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shared post stats */}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <i className="fa-regular fa-heart"></i>
              <span>{sharedPostData?.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fa-regular fa-comment"></i>
              <span>{sharedPostData?.commentCount || 0}</span>
            </div>
          </div>
        </div>

        {/* View original post button */}
        <div className="px-3 py-2 border-t border-gray-200 bg-gray-100">
          <NavLink
            to={`/post/${sharedPostData?._id}`}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <i className="fa-solid fa-external-link-alt"></i>
            Xem bài viết gốc
          </NavLink>
        </div>
      </div>
    );
  };

  const handleOpenComment = () => {
    if (openComment) {
      setOpenComment(false);
    } else {
      setOpenComment(true);
    }
  };

  useEffect(() => {
    if (openComment) fetchComments(post._id);
  }, [openComment, post._id, fetchComments]);

  const onCreate = async (content, parentComment = null) => {
    const success = await handleCreateComment({
      post: post._id,
      author: userId,
      content,
      parentComment,
    });
    if (success) {
      await fetchComments(post._id);
      setNewComment("");
    }
  };

  const onDelete = async (commentId) => {
    const success = await handleDeleteComment(commentId, userId);
    if (success) await fetchComments(post._id);
  };

  // Xử lý cập nhật bài viết 
  const handleUpdateSuccess = (updatedPost) => {
    setDataPost(prev => prev.map(p => 
      p._id === updatedPost._id ? { ...p, ...updatedPost } : p
    ));
    
    if (onUpdatePost) {
      onUpdatePost(updatedPost);
    }
    setShowEditModal(false);
  };



  const handleReport = async () => {
    const response = await handleReportPost(postIdReport, userId, reasonReport);
    if (response?.Ec === 0) {
      setPostIdReport("");
      setReasonReport("");
      setShow(false);
      toast.success("bạn đã report bài viết thành công");
    } else {
      toast.warning(response?.Mes);
    }
  };

  
  
  const showModalChooseReason = (postId) => {
    setShow(true);
    setPostIdReport(postId);
  };
  
  const handleSharePost = () => {
    setShareContent(post);
    setShareModalShow(true);
  };
  
  return (
    <>
      <div
        key={index}
        className="w-full rounded bg-[#ffffff] px-3 py-2 border-[1px] border-gray-200 text-black shadow-sm transition-all duration-300"
        data-post-id={post._id}
      >
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <NavLink
              to={`/profile/${post?.author?._id}`}
              className="flex justify-center items-center"
            >
              <img
                src={dataPost[0]?.author?.avatar || avatar}
                className="rounded-full w-10 h-10"
                alt="user avatar"
              />
            </NavLink>
            <div className="flex flex-col gap-1">
              <NavLink
                to={`/profile/${post?.author?._id}`}
                className="font-semibold text-black !no-underline hover:underline"
              >
                {dataPost[0]?.author?.name}
              </NavLink>
              <div className="flex items-center gap-2">
                <span className="opacity-40 text-sm">{timeText}</span>
                {isSharedPost && (
                  <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                    <i className="fa-solid fa-share text-xs"></i>
                    <span>Đã chia sẻ</span>
                  </span>
                )}
                {dataPost[0]?.visibility === "private" && (
                  <i className="fa-solid fa-lock opacity-40 text-[14px]"></i>
                )}
                {dataPost[0]?.visibility === "friends" && (
                  <i className="fa-solid fa-user-group opacity-40 text-[14px]"></i>
                )}
                {dataPost[0]?.visibility === "public" && (
                  <i className="fa-solid fa-earth-europe opacity-40 text-[14px]"></i>
                )}
              </div>
            </div>
          </div>
          <div
            onClick={() => setOpenMenu(!openMenu)}
            ref={menuRef}
            className="cursor-pointer relative"
          >
            <i className="fa-solid fa-ellipsis w-[24px] text-[20px] text-gray-600"></i>
            {openMenu && (
              <div className="absolute top-6 right-0 bg-white rounded-lg border border-gray-300 shadow-lg z-50 min-w-[150px] flex flex-col py-1">
                {post?.author?._id === userId ? (
                  <>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditModal(true);
                        setOpenMenu(false);
                      }}
                      className="hover:bg-gray-100 px-3 py-2 text-left text-blue-600 cursor-pointer border-b border-gray-100"
                    >
                      <i className="fa-solid fa-pen mr-2"></i>
                      Chỉnh sửa
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post._id);
                      }}
                      className="hover:bg-gray-100 px-3 py-2 text-left text-red-600 cursor-pointer"
                    >
                      <i className="fa-solid fa-trash mr-2"></i>
                      Gỡ bài viết
                    </div>
                  </>
                ) : (
                  <div
                    className="hover:bg-gray-100 px-3 py-2 text-left text-gray-700 cursor-pointer"
                    onClick={() => showModalChooseReason(post._id)}
                  >
                    <i className="fa-solid fa-triangle-exclamation mr-2 text-orange-500"></i>
                    Báo cáo
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main post caption */}
        <div className="w-full flex flex-col mt-2 py-2">
          {dataPost[0]?.caption && (
            <div className="text-[15px] whitespace-pre-wrap mb-3">
              <Caption caption={dataPost[0].caption} />
            </div>
          )}

          {/* Shared post section */}
          {isSharedPost && renderSharedPost()}

          {/* Original post media (if not shared post) */}
          {!isSharedPost && mediaList?.length > 0 && (
            <div className="mt-3">{renderMedia()}</div>
          )}
        </div>

        {/* Post stats and actions */}
        <div className="w-full flex items-center justify-around text-[15px] border-t border-gray-100 pt-2">
          <div
            className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#f0f0f0] py-2 gap-2 rounded-lg transition-colors duration-150"
            onClick={() => handleLikePost(post._id)}
          >
            <i
              style={{ color: statusLike[post._id] ? "#6967e1" : "" }}
              className={`fa-${
                statusLike[post._id] ? "solid" : "regular"
              } fa-heart w-4 transition-all duration-150 ${
                statusLike[post._id] ? "text-[#6967e1]" : "text-gray-600"
              }`}
            ></i>
            <span className={`${statusLike[post._id] ? "text-[#6967e1] font-medium" : "text-gray-600"}`}>
              {dataPost[0]?.likes?.length || 0}
            </span>
          </div>
          <div
            className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#f0f0f0] py-2 gap-2 rounded-lg transition-colors duration-150"
            onClick={handleOpenComment}
          >
            <i className="fa-regular fa-comment w-4 text-gray-600"></i>
            <span className="text-gray-600">{post?.commentCount || 0} bình luận</span>
          </div>
          <div
            className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#f0f0f0] py-2 gap-2 rounded-lg transition-colors duration-150"
            onClick={handleSharePost}
          >
            <i className="fa-solid fa-share w-4 text-gray-600"></i>
            <span className="text-gray-600">Chia sẻ</span>
          </div>
        </div>

        {/* Comments section */}
        {openComment && (
          <div className="w-full flex flex-col items-center gap-2 mt-3 border-t border-gray-100 pt-3">
            <div className="w-full flex items-center gap-2">
              <input
                type="text"
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
                className="bg-gray-100 py-2 rounded-lg w-[85%] focus:outline-none focus:ring-2 focus:ring-blue-300 px-3"
                placeholder="Viết bình luận của bạn ..."
              />
              <button
                onClick={() => onCreate(newComment)}
                className="w-[15%] flex justify-center bg-blue-500 text-white font-medium py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newComment.trim()}
              >
                Đăng
              </button>
            </div>

            {/* Display comments - Chỉ hiển thị tối đa 4 comments */}
            <div className="w-full flex flex-col gap-3 mt-3 mb-3">
              {loading ? (
                <div className="text-gray-400 text-center py-4">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Đang tải bình luận...
                </div>
              ) : displayedComments.length > 0 ? (
                displayedComments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    userId={userId}
                    onReply={onCreate}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <div className="text-gray-400 text-sm text-center py-4">
                  Hãy là người đầu tiên bình luận...
                </div>
              )}
            </div>
            
            {/* Chỉ hiển thị nút "Xem tất cả bình luận" khi có nhiều hơn 4 comments */}
            {hasMoreComments && (
              <div 
                onClick={() => navigate(`/post/${post._id}`)} 
                className="w-full flex items-center justify-center text-blue-500 hover:text-blue-700 cursor-pointer text-sm font-medium"
              >
                <i className="fa-solid fa-chevron-down mr-1"></i>
                Xem tất cả bình luận ({comments.length})
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Modal show={show} onHide={() => setShow(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Báo cáo bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-3">Lý do báo cáo bài viết ?</h5>
          <div className="max-h-60 overflow-y-auto">
            {REPORT_REASONS.map((reason, index) => (
              <div key={index} className="mb-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reportReason"
                    value={reason}
                    id={`reason-${index}`}
                    onChange={(e) => setReasonReport(e.target.value)}
                  />
                  <label
                    className="form-check-label ml-2"
                    htmlFor={`reason-${index}`}
                  >
                    {reason}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleReport}
            disabled={!reasonReport}
          >
            Xác nhận báo cáo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Share Modal */}
      <ModalSharePost
        shareContent={shareContent}
        shareModalShow={shareModalShow}
        setShareModalShow={setShareModalShow}
        setShareContent={setShareContent}
        userId={userId}
      />

      {/* Edit Modal */}
      <ModalEditPost
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        post={post}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default PostCard;