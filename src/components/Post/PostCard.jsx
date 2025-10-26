import { useEffect, useState } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { LikePost } from "../../utils/api.customize";
import avatar from "../../assets/download.png";
import { useComment } from "../../hook/useComment";
import CommentItem from "./CommentItem";

const PostCard = ({ post, index }) => {
  const [statusLike, setStatusLike] = useState({})
  const [openComment, setOpenComment] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [dataPost, setDataPost] = useState([])
  const mediaList = Array.isArray(post?.media)
    ? post.media.filter((m) => m?.url)
    : post?.media?.url
    ? [post.media]
    : []
  const user = useSelector((state) => state.user.account)
  const userId = user?.id
  const { comments, loading, fetchComments, handleCreateComment, handleDeleteComment } = useComment()

  useEffect(() => {
    if (post) {
      const postArray = Array.isArray(post) ? post : [post]
      setDataPost(postArray)
      syncLikesStatus(postArray)
    }
  }, [post, userId])

  const syncLikesStatus = (posts) => {
    const status = {}
    posts.forEach((item) => {
      status[item._id] = item.likes.some((like) => {
        if (typeof like === "string") return like === userId
        if (typeof like === "object" && like._id) return like._id === userId
        return false
      })
    })
    setStatusLike(status)
  }

  const handleLikePost = async (postId) => {
    try {
      const response = await LikePost(userId, postId)
      if (response?.Ec === 0) {
        setStatusLike((prev) => ({
          ...prev,
          [postId]: !prev[postId],
        }))
        setDataPost((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              const alreadyLiked = post.likes.some((like) => {
                if (typeof like === "string") return like === userId
                if (typeof like === "object" && like._id)
                  return like._id === userId
                return false
              })

              const updateLikes = alreadyLiked
                ? post.likes.filter((like) => {
                    if (typeof like === "string") return like !== userId
                    if (typeof like === "object" && like._id)
                      return like._id !== userId;
                    return true
                  })
                : [...post.likes, userId]
              return { ...post, likes: updateLikes }
            }
            return post
          })
        );
      } else {
        toast.error(response?.Mes)
      }
    } catch (e) {
      console.error("Lỗi like:", error)
    }
  }
  const renderMedia = () => {
    if (mediaList[0]?.type === "video") {
      const video = mediaList[0]
      return (
        <div className="relative w-full rounded overflow-hidden bg-black aspect-video">
          <video
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
          <img
              src={mediaList[0].url}
              className="rounded object-contain max-w-full max-h-[600px]"
            />
        </div>
      );
    }
    const displayImageList = mediaList.slice(0, 9)
    const hiddenCount = mediaList.length - 9
    return (
      <div
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
    )
  }

  const handleOpenComment = () => {
    if (openComment) {
      setOpenComment(false)
    } else {
      setOpenComment(true)
    }
  }

  useEffect(() => {
    if (openComment) fetchComments(post._id)
  }, [openComment, post._id, fetchComments])

  const onCreate = async (content, parentComment = null) => {
    const success = await handleCreateComment({
      post: post._id,
      author: userId,
      content, 
      parentComment,
    })
    if (success) {
      await fetchComments(post._id)
      setNewComment("")
    }
  }

  const onDelete = async (commentId) => {
    const success = await handleDeleteComment(commentId, userId)
    if (success) await fetchComments(post._id)
  }

  return (
    <div
      key={index}
      className="w-full rounded bg-[#222] px-3 py-2 border-[1px] border-[#494949]"
    >
      <div className="w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center">
            <img
              src={dataPost[0]?.author?.avatar || avatar}
              className="rounded-full w-10"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-white">
              <div>{dataPost[0]?.author?.name}</div>
              <div className="flex items-center gap-2">
                <span className="opacity-80">2 giờ</span>
                <i className="fa-solid fa-earth-americas"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="cursor-pointer">
          <i className="fa-solid fa-ellipsis w-[24px] text-[20px]"></i>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 mt-2 !pl-[52px]">
        {dataPost[0]?.caption && (
          <div className="text-[14px]">{post.caption}</div>
        )}
        {mediaList?.length === 0 || <div className="mt-3">{renderMedia()}</div>}
      </div>
      <hr />
      <div className="w-full flex items-center mb-1 justify-around text-[15px]">
        <div
          className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#5d5d5d7c] py-1 gap-2 rounded"
          onClick={() => handleLikePost(post._id)}
        >
          <i
            style={{ color: statusLike[post._id] ? "#b15426" : "" }}
            className={`fa-${
              statusLike[post._id] ? "solid" : "regular"
            } fa-heart w-4 transition-all duration-150`}
          ></i>
          <span>{dataPost[0]?.likes?.length || 0}</span>
        </div>
        <div
          className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#5d5d5d7c] py-1 gap-2 rounded"
          onClick={handleOpenComment}
        >
          <i className="fa-regular fa-comment w-4"></i>
          <span>{comments?.length || 0} bình luận</span>
        </div>
        <div className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#5d5d5d7c] py-1 gap-2 rounded">
          <i className="fa-solid fa-share w-4"></i>
          <span>Chia sẻ</span>
        </div>
      </div>
      {openComment && (
        <div className="w-full flex flex-col items-center">
          <div className="w-full bg-[#494949] h-[1px] my-2"></div>
          {/* Input comment */}
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              onChange={(e) => setNewComment(e.target.value)} value={newComment}
              className="bg-[#494949] py-2 rounded w-[85%] focus:bg-[#222] focus:outline-1 outline-[#b15426] px-2"
              placeholder="Viết bình luận của bạn ..."
            />
            <div onClick={() => onCreate(newComment)} className="w-[15%] flex justify-center bg-[#b15426] py-2 rounded cursor-pointer hover:bg-[#89421e] text-white">
              Đăng
            </div>
          </div>

          <div className="w-full bg-[#494949] h-[1px] my-2"></div>
          {/* Display comment */}
          <div className="w-full flex flex-col gap-2 mt-2 mb-3 items-center">
            {loading ? (
              <div className="text-gray-400">Đang tải bình luận...</div>
            ) : comments?.length > 0 ? (
              comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  userId={userId}
                  onReply={onCreate}
                  onDelete={onDelete} 
                />
              ))
            ) : (
              <div className="text-gray-400 text-sm">Hãy là người đầu tiên bình luận.....</div>
            )}
          </div>
          {comments?.length > 3 && (
              <div className="w-full flex items-center justify-center underline cursor-pointer   opacity-60 text-[16px] hover:opacity-80">
                Xem tất cả bình luận
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
