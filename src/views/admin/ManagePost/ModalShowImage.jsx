import { Modal } from "antd";

const ModalShowImage = (props) => {
  const { detailPost, showDetailImage, setShowDetailImage } = props;

  return (
    <>
      <Modal
        open={showDetailImage}
        onCancel={() => setShowDetailImage(false)}
        footer={null}
        width={600}
      >
        {detailPost && (
          <div className="space-y-4">
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
        )}
      </Modal>
    </>
  );
};
export default ModalShowImage;
