import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { statusAccount } from "../../../utils/api.customize";
import { toast } from "react-toastify";
const ModalEditUser = (props) => {
  const { show, setShow, dataUserEdit, handleGetUserTable } = props;
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState();
  useEffect(() => {
    if (dataUserEdit?._id) {
      setUserId(dataUserEdit?._id);
    }
  }, [dataUserEdit]);
  const handleClose = () => {
    setShow(false);
    setStatus("");
    setUserId();
  };

  const handleStatusAccount = async (status) => {
    if (!status) return;
    const response = await statusAccount(status, userId);
    if (response?.Ec === 0) {
      toast.success(response.Mes);
      handleClose();
      handleGetUserTable();
    } else {
      toast.error(res?.Mes);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="text-center">
          {dataUserEdit?.statusAccount === "banned" ? (
            <span style={{ color: "red", fontSize: "20px" }}>
              Tài khoản này đang bị khóa{" "}
            </span>
          ) : (
            <span style={{ color: "red", fontSize: "20px" }}>
              Bạn có chắc muốn khóa tài khoản này ?{" "}
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          {dataUserEdit?.statusAccount === "banned" ? (
            <Button
              variant="warning"
              onClick={() => handleStatusAccount("active")}
            >
              UnBan account
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={() => handleStatusAccount("banned")}
            >
              confirm ban account
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalEditUser;
