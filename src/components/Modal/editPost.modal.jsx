import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updatePost } from "../../utils/api.customize";

const ModalEditPost = ({ show, onHide, post, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState("public");

  useEffect(() => {
    if (post) {
      setCaption(post.caption || "");
      setVisibility(post.visibility || "public");
    }
  }, [post, show]);

  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast.warning("Nội dung bài viết không được để trống");
      return;
    }

    const hasCaptionChanged = caption !== (post.caption || "");
    const hasVisibilityChanged = visibility !== (post.visibility || "public");
    
    if (!hasCaptionChanged && !hasVisibilityChanged) {
      toast.warning("Không có thay đổi nào");
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        _id: post._id,
        caption,
        visibility
      };
      
      const response = await updatePost(updateData);
      if (response?.Ec === 0) {
        toast.success("Cập nhật bài viết thành công");
        if (onUpdateSuccess) {
          onUpdateSuccess({ ...post, caption, visibility });
        }
        onHide();
      } else {
        toast.error(response?.Mes || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Edit post error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onHide}
      />
      
      <div className="flex items-center justify-center p-4 w-screen h-screen">
        <div className="relative min-w-[500px] max-h-[90vh] transform overflow-auto rounded bg-white border border-gray-200 shadow-xl transition-all">
          
          <div className="w-full flex items-center justify-between border-b border-gray-300 py-3 px-3">
            <span className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <i className="fa-solid fa-pen text-blue-600"></i>
              Chỉnh sửa bài viết
            </span>
            <button
              onClick={onHide}
              className="rounded-lg! p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div className="w-ful px-3 py-2 flex flex-col gap-2">
            <div className="w-full mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung bài viết
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Bạn đang nghĩ gì?"
                maxLength={5000}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors resize-y"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <i className="fa-solid fa-keyboard"></i>
                  Nhấn Ctrl + Enter để lưu nhanh
                </span>
                <span className={`text-xs ${caption.length > 4500 ? 'text-amber-500' : 'text-gray-500'}`}>
                  {caption.length}/5000
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2!">
                Chế độ hiển thị
              </label>
              <div className="w-full flex flex-col rounded border border-gray-200 bg-gray-50">
                <label className="flex! gap-2 items-center cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="h-4 w-4"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full">
                      <i className="fa-solid fa-earth-europe text-gray-500 text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Công khai</div>
                      <div className="text-sm text-gray-500">Mọi người đều có thể xem</div>
                    </div>
                  </div>
                </label>

                <label className="flex! gap-2 items-center cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="friends"
                    checked={visibility === "friends"}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="h-4 w-4"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full">
                      <i className="fa-solid fa-user-group text-gray-500 text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Bạn bè</div>
                      <div className="text-sm text-gray-500">Chỉ bạn bè có thể xem</div>
                    </div>
                  </div>
                </label>

                <label className="flex! gap-2 items-center cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === "private"}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="h-4 w-4"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full">
                      <i className="fa-solid fa-lock text-gray-500 text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Chỉ mình tôi</div>
                      <div className="text-sm text-gray-500">Chỉ bạn có thể xem</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="w-full pt-1 flex justify-center items-center px-1">
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col justify-center gap-1">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <i className="fa-solid fa-info-circle h-2"></i>
                    <span>Bài viết hiện tại:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex gap-1 items-center rounded-full px-3 py-1 text-xs font-medium ${
                      post?.visibility === 'public' ? 'bg-blue-100 text-blue-800' :
                      post?.visibility === 'friends' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <i className={`fa-solid ${
                        post?.visibility === 'public' ? 'fa-earth-europe' :
                        post?.visibility === 'friends' ? 'fa-user-group' :
                        'fa-lock'
                      }`}></i>
                      {post?.visibility === 'public' ? 'Công khai' :
                       post?.visibility === 'friends' ? 'Bạn bè' :
                       'Chỉ mình tôi'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <i className="fa-solid fa-calendar"></i>
                      {post?.createdAt && new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Thống kê:</div>
                  <div className="flex gap-3 items-center">
                    <span className="flex items-center text-xs text-gray-500 gap-1">
                      <i className="fa-regular fa-heart h-2"></i>
                      {post?.likes?.length || 0}
                    </span>
                    <span className="flex items-center text-xs text-gray-500 gap-1">
                      <i className="fa-regular fa-comment h-2"></i>
                      {post?.commentCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-200 bg-gray-50 px-6 py-3">
            <div className="flex justify-end gap-2">
              <button
                onClick={onHide}
                disabled={loading}
                className="rounded-lg! px-5! py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-xmark"></i>
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !caption.trim()}
                className="rounded-lg! px-5! py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditPost;