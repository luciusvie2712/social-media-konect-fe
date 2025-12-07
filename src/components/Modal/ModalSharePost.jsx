import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { handleSharePost } from "../../utils/api.customize";
import avatar from "../../assets/download.png";
import { useSelector } from "react-redux";

const ModalSharePost = ({shareModalShow, setShareModalShow, shareContent, setShareContent, userId}) => {
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const user = useSelector((state) => state.user.account);

  const postId = shareContent?._id;
  const originalPost = shareContent?.sharedPost || shareContent;

  useEffect(() => {
    setCharCount(caption.length);
  }, [caption]);

  const handleConfirmSharePost = async () => {
    if (!postId || !userId) {
      toast.error("Không thể chia sẻ bài viết");
      return;
    }

    setLoading(true);
    try {
      const res = await handleSharePost(userId, postId, caption, visibility);
      if (res && res.Ec === 0) {
        toast.success("Chia sẻ bài viết thành công");
        handleClose();
      } else {
        toast.error(res?.Mes || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShareModalShow(false);
    setCaption("");
    setVisibility("public");
    setShareContent(null);
    setLoading(false);
  };

  const renderOriginalPostPreview = () => {
    if (!originalPost) return null;

    const media = Array.isArray(originalPost.media) 
      ? originalPost.media[0] 
      : originalPost.media;
    
    const isShared = shareContent?.sharedPost;
    const showAuthor = isShared ? shareContent.author : originalPost.author;

    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={showAuthor?.avatar || avatar}
            alt={showAuthor?.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
          <div>
            <div className="font-semibold text-gray-900">
              {showAuthor?.name || "Ẩn danh"}
              {isShared && (
                <span className="ml-2 text-xs text-blue-600">
                  {originalPost.author?.name}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(originalPost.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {originalPost.caption && (
          <div className="text-gray-800 mb-3 text-sm bg-white p-3 rounded border border-gray-100">
            {originalPost.caption.length > 200
              ? originalPost.caption.substring(0, 200) + "..."
              : originalPost.caption}
          </div>
        )}

        {media?.url && (
          <div className="rounded overflow-hidden border border-gray-200">
            {media.type === "video" ? (
              <div className="relative aspect-video bg-black">
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  poster={media.thumbnail}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                    <i className="fas fa-play text-white"></i>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={media.url}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            )}
          </div>
        )}
      </div>
    )
  }

  const visibilityOptions = [
    { value: "public", icon: "fa-earth-europe", label: "Công khai", description: "Mọi người có thể xem" },
    { value: "friends", icon: "fa-user-group", label: "Bạn bè", description: "Chỉ bạn bè của bạn" },
    { value: "private", icon: "fa-lock", label: "Chỉ mình tôi", description: "Chỉ bạn mới xem được" }
  ]

  const selectedVisibility = visibilityOptions.find(opt => opt.value === visibility)

  if (!shareModalShow) return null

  return (
    <div className=" w-screen h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-[600px] mx-auto shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <i className="fas fa-share-alt text-blue-400 text-2xl"></i>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[25px] font-semibold text-gray-900">
                  Chia sẻ bài viết
                </span>
                <p className="text-sm text-gray-500">
                  Chia sẻ bài viết này với mọi người
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full! hover:bg-gray-100 flex items-center justify-center"
            >
              <i className="fas fa-times text-gray-500"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto py-3 px-3">
          {/* Người chia sẻ */}
          <div className="flex items-start gap-3 bg-gray-50 pb-2">
            <img
              src={user?.avatar || avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{user?.name || "Bạn"}</div>
              <div className="relative mt-1">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-40 px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {visibilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Input caption */}
          <div className="mb-4 w-full">
            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setCaption(e.target.value);
                  }
                }}
                placeholder="Viết cảm nghĩ của bạn về bài viết này..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-gray-900 placeholder-gray-500 min-h-[100px]"
                rows="3"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {charCount}/500
              </div>
            </div>
          </div>

          {/* Preview bài viết gốc */}
          <div className="w-full ">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-eye text-gray-400"></i>
              <span className="font-medium text-gray-700">Bài viết gốc</span>
            </div>
            {renderOriginalPostPreview()}
          </div>

          {/* CTA Button */}
          <div className="w-full flex flex-col items-center">
            <button
              onClick={handleConfirmSharePost}
              disabled={loading || !postId || !userId}
              className={`w-full py-3 rounded-lg font-medium text-white ${
                loading || !postId || !userId
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang chia sẻ...</span>
                </div>
              ) : (
                "Chia sẻ bài viết"
              )}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-3">
              Bằng cách chia sẻ, bạn đồng ý với điều khoản dịch vụ và chính sách quyền riêng tư
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalSharePost;