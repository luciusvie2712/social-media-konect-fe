import { useEffect, useState, useRef } from "react";
import avatar from "../../assets/download.png";
import { createPostAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MediaGrid from "../Post/MediaGrid";

const CreatePost = ({ isOpen, setIsOpen, account }) => {
  if (!isOpen) return null;
  const userId = useSelector((state) => state.user.account.id);
  
  useEffect(() => {
    if (userId) {
      setFormCreate({
        ...formCreate,
        author: userId,
      });
    }
  }, [userId]);

  const [formCreate, setFormCreate] = useState({
    author: userId,
    caption: "",
    media: [],
    mediaPreview: [],
    visibility: "public",
  });

  const formData = new FormData();
  formData.append("author", formCreate.author);
  formData.append("caption", formCreate.caption);
  formData.append("visibility", formCreate.visibility);
  formCreate.media.forEach((file) => {
    formData.append("media", file);
  });
  const fileRef = useRef(null);
  const addMoreRef = useRef(null);

  const handleOnchangeInput = (e) => {
    setFormCreate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnchangeFile = (event, append = false) => {
    const files = event.target.files;
    if (!files || !files.length) return;
    const mediaPreviewArray = [];
    const mediaArray = [];
    Array.from(files).forEach((file) => {
      mediaPreviewArray.push({
        url: URL.createObjectURL(file),
        type: file.type,
      });
      mediaArray.push(file);
    });
    if (append) {
      setFormCreate((prev) => ({
        ...prev,
        mediaPreview: [...prev.mediaPreview, ...mediaPreviewArray],
        media: [...prev.media, ...mediaArray],
      }));
    } else {
      setFormCreate((prev) => ({
        ...prev,
        mediaPreview: mediaPreviewArray,
        media: mediaArray,
      }));
    }
    event.target.value = "";
  };
  const handleCreatePost = async () => {
    let res = await createPostAPI(formData);
    if (res?.Ec === 0) {
      toast.success(res.Mes);
      setFormCreate({
        ...formCreate,
        caption: "",
        visibility: "",
        media: [],
        mediaPreview: [],
      });
    } else {
      toast.error(res?.Mes);
    }
  };
  const handleRemoveMedia = (index) => {
    setFormCreate((prev) => {
      const newPreview = [...prev.mediaPreview];
      const newMedia = [...prev.media];
      newPreview.splice(index, 1);
      newMedia.splice(index, 1);
      return { ...prev, mediaPreview: newPreview, media: newMedia };
    });
  };

  useEffect(() => {
    if (!isOpen) {
      formCreate.mediaPreview.forEach((p) => {
        try {
          URL.revokeObjectURL(p.url);
        } catch (e) {}
      });
      setFormCreate({
        author: "",
        caption: "",
        media: [],
        mediaPreview: [],
        visibility: "public",
      });
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
      <div
        className="absolute right-4 top-4 px-3 py-2 rounded-full cursor-pointer bg-[#cdcdcd] hover:bg-[#3a3a3a]"
        onClick={() => setIsOpen(false)}
      >
        <i className="fa-solid fa-xmark opacity-70"></i>
      </div>

      <form
        className="bg-[#ffffff] text-black w-full max-w-[700px] max-h-[90vh] rounded-lg overflow-hidden flex flex-col shadow-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="sticky top-0 z-20 bg-[#ffffff] border-b px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Tạo bài viết</div>
          <div className="text-sm text-gray-300">
            {formCreate.mediaPreview.length} media
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex gap-3 items-center mb-3">
            <img src={avatar} className="rounded-full w-10 h-10" />
            <div className="flex flex-col">
              <div className="font-semibold text-sm sm:text-base">
                {account.name}
              </div>
              <select
                className="bg-white rounded cursor-pointer text-sm px-2 py-1 mt-1 border-1 border-gray-400 outline-none"
                name="visibility"
                value={formCreate.visibility}
                onChange={handleOnchangeInput}
              >
                <option value="public">Công khai</option>
                <option value="friends">Bạn bè</option>
                <option value="private">Chỉ mình tôi</option>
              </select>
            </div>
          </div>
          <textarea
            rows={3}
            name="caption"
            value={formCreate.caption}
            onChange={handleOnchangeInput}
            placeholder="Hôm nay bạn thấy thế nào ....."
            className="w-full px-3 py-2 rounded-md bg-transparent border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm sm:text-base resize-none mb-4"
          />

          <div className="mb-4">
            <input
              ref={fileRef}
              type="file"
              id="media"
              accept="image/*,video/*"
              className="hidden"
              multiple
              onChange={(e) => handleOnchangeFile(e, false)}
            />
            <label
              htmlFor="media"
              className="inline-block cursor-pointer text-sm sm:text-base px-3 py-2 bg-[#ffffff] border-1 border-gray-400 rounded hover:bg-[#cdcdcd]"
            >
              Chọn ảnh/video (thay thế)
            </label>
            <span className="text-xs text-gray-400 ml-2">hoặc kéo & thả</span>
          </div>

          {formCreate.mediaPreview.length > 0 && (
            <MediaGrid
              mediaPreview={formCreate.mediaPreview}
              onRemove={handleRemoveMedia}
            />
          )}
        </div>

        <div className="sticky bottom-0 z-20 bg-[#ffffff] border-t px-4 py-3 flex gap-3 items-center">
          <div className="flex-1">
            <input
              ref={addMoreRef}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              multiple
              onChange={(e) => handleOnchangeFile(e, true)}
            />
            <button
              type="button"
              onClick={() => addMoreRef.current.click()}
              className="px-3 py-2 bg-[#ffffff] border-1 border-gray-400 rounded hover:bg-[#cdcdcd] text-sm"
            >
              Thêm ảnh/video
            </button>
          </div>
          <div className="w-1/2">
            <button
              type="button"
              className="w-full bg-blue-200 px-4 py-2 font-semibold rounded hover:bg-blue-400"
              onClick={handleCreatePost}
            >
              Đăng bài viết
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
