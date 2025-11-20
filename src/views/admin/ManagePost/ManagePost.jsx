import { useEffect, useState } from "react";
import { getTablePost } from "../../../utils/api.customize";
import TablePost from "./TablePost";
import ModalDetail from "./ModalDetail";
import ModalShowImage from "./ModalShowImage";

const ManagePost = () => {
  let limit = 8;
  const [currentPages, setCurrentPages] = useState(1);
  const [listPostTable, setListPostTable] = useState();
  const [totalPages, setTotalpages] = useState(0);
  const [showModal, setshowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailPost, setDetailPost] = useState(null);
  const [showDetailImage, setShowDetailImage] = useState(false);
  useEffect(() => {
    handleGetPostTable();
  }, [currentPages]);
  const handleGetPostTable = async () => {
    try {
      let response = await getTablePost(limit, currentPages);
      if (response?.Ec === 0 && response?.data) {
        setListPostTable(response.data);
      }
      if (response?.totalPages) {
        setTotalpages(response.totalPages);
      }
    } catch (e) {
      toast.error(response?.Mes);
    }
  };
  const handleSetShowModal = () => setshowModal((prev) => !prev);
  const handleShowDetailPost = (dataPost) => {
    setDetailPost(dataPost);
    setShowDetail(true);
  };
  const handleShowDetailImage = (dataPost) => {
    setDetailPost(dataPost);
    setShowDetailImage(true);
  };
  return (
    <>
      <TablePost
        listPostTable={listPostTable}
        currentPages={currentPages}
        setCurrentPages={setCurrentPages}
        totalPages={totalPages}
        handleGetPostTable={handleGetPostTable}
        setShowModal={handleSetShowModal}
        showModal={showModal}
        handleShowDetailPost={handleShowDetailPost}
        handleShowDetailImage={handleShowDetailImage}
      />
      <ModalDetail
        detailPost={detailPost}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
      />
      <ModalShowImage
        detailPost={detailPost}
        showDetailImage={showDetailImage}
        setShowDetailImage={setShowDetailImage}
      />
    </>
  );
};
export default ManagePost;
