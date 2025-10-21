import TableUser from "./TableUser";
import "./ManageUser.scss";
import { useEffect, useState } from "react";
import { getAllUserTable } from "../../../utils/api.customize";
import { toast } from "react-toastify";
import ModalEditUser from "./ModalEditUser";

const ManageUser = () => {
  let limit = 6;
  const [currentPages, setCurrentPages] = useState(1);
  const [listUserTable, setListUserTable] = useState();
  const [totalPages, setTotalpages] = useState(0);
  const [showModal, setshowModal] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState();
  const [showModalEdit, setShowModalEdit] = useState(false);
  useEffect(() => {
    handleGetUserTable();
  }, [currentPages]);
  const handleGetUserTable = async () => {
    try {
      let response = await getAllUserTable(limit, currentPages);
      if (response?.Ec === 0 && response?.data) {
        setListUserTable(response.data);
      }
      if (response?.totalPages) {
        setTotalpages(response.totalPages);
      }
    } catch (e) {
      toast.error(response?.Mes);
    }
  };
  const handleSetShowModal = () => setshowModal((prev) => !prev);
  const handleEditUser = (data) => {
    setShowModalEdit(true);
    if (data) {
      setDataUserEdit(data);
    }
  };

  return (
    <>
      <div className="manage-user-container">
        <TableUser
          listUserTable={listUserTable}
          currentPages={currentPages}
          setCurrentPages={setCurrentPages}
          totalPages={totalPages}
          handleGetUserTable={handleGetUserTable}
          setShowModal={handleSetShowModal}
          showModal={showModal}
          handleEditUser={handleEditUser}
        />
        <ModalEditUser
          handleGetUserTable={handleGetUserTable}
          setShow={setShowModalEdit}
          show={showModalEdit}
          dataUserEdit={dataUserEdit}
        />
      </div>
    </>
  );
};
export default ManageUser;
