import { Modal } from "antd";
import "./ModalDetail.scss";

const ModalDetail = (props) => {
  const { detailPost, setShowDetail, showDetail } = props;
  return (
    <>
      <Modal
        open={showDetail}
        onCancel={() => setShowDetail(false)}
        footer={null}
        width={700}
      >
        {detailPost && (
          <div className="modal-container">
            <p className="header-detail">Detail Post</p>
            <div className="space-y-4">
              <p>
                <b>Author:</b> {detailPost.author?.name}
              </p>
              <p>
                <b>Caption:</b> {detailPost.caption}
              </p>
              {/* <p>
                <b>Like:</b> {detailPost.likes.length}
              </p> */}
              <p>
                <b>CreatedAt:</b>{" "}
                {new Date(detailPost.createdAt).toLocaleString()}
              </p>
              <p className="d-flex">
                <b>Reports:</b>
                <span style={{ marginLeft: "6px", color: "red" }}>
                  {detailPost.reports?.length || 0}
                </span>
              </p>

              <div className="mt-3">
                <b>Media:</b>

                {detailPost.media?.length > 0 ? (
                  <div className="media-content">
                    {detailPost.media.map((item) =>
                      item.type === "image" ? (
                        <img
                          key={item._id}
                          src={item.url}
                          className="w-full rounded-lg"
                        />
                      ) : (
                        <video
                          key={item._id}
                          src={item.url}
                          controls
                          className="w-full rounded-lg"
                        />
                      )
                    )}
                  </div>
                ) : (
                  <p>No media</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
export default ModalDetail;
