import { Modal } from "react-bootstrap";
import "../../styles/ModalSharePost.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { handleSharePost } from "../../utils/api.customize";
const ModalSharePost = (props) => {
  const {
    shareModalShow,
    setShareModalShow,
    shareContent,
    setShareContent,
    userId,
  } = props;
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState("public");
  const postId = shareContent?._id;
  const handleConfrimSharePost = async () => {
    if (!postId || !userId) {
      toast.error("Không thể chia sẻ bài viết");
      return;
    }
    console.log("c", shareContent);
    const res = await handleSharePost(userId, postId, caption, visibility);
    if (res && res.Ec === 0) {
      toast.success("Chia sẻ bài viết thành công");
      setShareModalShow(false);
      setCaption("");
      setVisibility("public");
      setShareContent(null);
    } else {
      toast.error(res?.Mes || "Có lỗi xảy ra khi chia sẻ bài viết");
    }
  };
  const handleClose = () => {
    setShareModalShow(false);
    setCaption("");
  };
  return (
    <>
      <Modal
        show={shareModalShow}
        onHide={() => handleClose(false)}
        backdrop="static"
      >
        <Modal.Header
          closeButton
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Modal.Title style={{ width: "100%" }}>Chia sẻ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="share-container">
            <div className="share-content">
              <div className="avt-author">
                <img
                  src={shareContent?.author?.avatar}
                  alt=""
                  className="w-9 h-9 rounded-full"
                />
              </div>
              <div className="options">
                <div className="name-author">
                  {shareContent?.author?.name || "Ẩn danh"}
                </div>
                <div className="option-items">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option value="public">Công khai</option>
                    <option value="friends">Bạn bè</option>
                    <option value="private">Chỉ mình tôi</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="caption-post-share">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                type="text"
                placeholder="Viết cảm nghĩ của bạn về bài viết bạn chia sẻ..."
              />
            </div>
            <div className="btn-confirm-share" onClick={handleConfrimSharePost}>
              Chia sẻ bài viết
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalSharePost;
