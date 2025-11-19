import { useEffect, useState } from "react";
import { getTablePost } from "../../../utils/api.customize";
import TablePost from "./TablePost";

const ManagePost = () => {
  let limit = 8;
  const [currentPages, setCurrentPages] = useState(1);
  const [listPostTable, setListPostTable] = useState();
  const [totalPages, setTotalpages] = useState(0);
  const [showModal, setshowModal] = useState(false);
  console.log("listPostTable", listPostTable);
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
      />
    </>
  );
};
export default ManagePost;
