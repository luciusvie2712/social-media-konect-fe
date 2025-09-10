import { useState } from "react";
import avatar from "../../assets/download.png";

const createPost = ({ isOpen, setIsOpen, account }) => {
  if (!isOpen) return null;
  const [formCreate, setFormCreate] = useState({
    author: "",
    caption: "",
    media: [],
    mediaPreview: [],
    visibility: "",
  });

  const formData = new FormData();
  formData.append("author", formCreate.author);
  formData.append("caption", formCreate.caption);
  formData.append("visibility", formCreate.visibility);
  formCreate.media.forEach((file) => {
    formData.append("media", file);
  });
  const handleOnchangeInput = (e) => {
    setFormCreate({
      ...formCreate,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnchangeFile = (event) => {
    const files = event.target.files;
    if (!files && !files[0]) return;

    const mediaPreviewArray = [];
    const mediaArray = [];

    Array.from(files).forEach((file) => {
      mediaPreviewArray.push({
        url: URL.createObjectURL(file),
        type: file.type,
      });
      mediaArray.push(file);
    });
    setFormCreate((prev) => ({
      ...prev,
      mediaPreview: mediaPreviewArray,
      media: mediaArray,
    }));
  };
  console.log(formCreate);
  return (
    <div className="w-screen h-screen flex justify-center items-center z-10 bg-[rgba(0,0,0,0.5)] fixed top-0 left-0">
      <div
        className="absolute right-2 top-2 border-1 px-3 py-2 rounded-full cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        V
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-[#242424] text-white flex flex-col items-center justify-center px-3 py-4 rounded w-[max(30vw,400px)]"
      >
        <div className="border-b-1 w-full text-center pb-3">
          <h3>Tạo bài viết</h3>
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex pt-4 gap-3 items-center">
            <div>
              <img src={avatar} className="rounded-full w-10" />
            </div>
            <div className="flex flex-col ">
              <div className="font-semibold text-[14px]">{account.name}</div>
              <div className="text-[14px]">
                <select
                  className="bg-black rounded cursor-pointer"
                  name="visibility"
                  value={formCreate["visibility"]}
                  onChange={handleOnchangeInput}
                >
                  <option value="public">Công khai</option>
                  <option value="friends">Bạn bè</option>
                  <option value="private">Chỉ mình tôi</option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-full px-1 py-2">
            <textarea
              rows={3}
              placeholder="Hôm nay bạn thấy thế nào ....."
              className=" w-full focus:outline-none"
              name="caption"
              value={formCreate["caption"]}
              onChange={handleOnchangeInput}
            />
          </div>
          <div className="flex justify-center items-center mb-4">
            <input
              type="file"
              name="media"
              id="media"
              className="hidden"
              onChange={handleOnchangeFile}
            />
            <label htmlFor="media">
              Add photo/video <small>or drag and drop</small>
            </label>
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            type="button"
            className="bg-[#2f2f2fca] px-3 py-2 font-semibold rounded"
          >
            Đăng bài viết
          </button>
        </div>
      </form>
    </div>
  );
};

export default createPost;
