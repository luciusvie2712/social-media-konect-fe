import {
  Alert,
  Button,
  Divider,
  message,
  Modal,
  Space,
  Table,
  Tag,
} from "antd";
import { toast } from "react-toastify";
import "./ManageUser.scss";
import { deleteUserTable } from "../../../utils/api.customize";
import { useState } from "react";
const TableUser = (props) => {
  const {
    listUserTable,
    currentPages,
    setCurrentPages,
    totalPages,
    handleGetUserTable,
    showModal,
    setShowModal,
    handleEditUser,
  } = props;
  const [selectedUser, setSelectedUser] = useState(null);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "Email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Account status",
      dataIndex: "accountStatus",
      key: "accountStatus",
    },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "roleId",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            style={{ color: "rgb(233, 185, 38)", fontSize: "15px" }}
            onClick={() => handleEditUser(record)}
          >
            Edit{" "}
          </a>
          <a
            style={{ color: "red", fontSize: "15px" }}
            onClick={() => handleDeleteUser(record)}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];
  //tailwind 2 cai the a cho dep dum`
  const dataWithKey = listUserTable?.map((item, index) => ({
    key: item._id || index,
    ...item,
  }));
  const handleDeleteUser = async (user) => {
    setShowModal();
    setSelectedUser(user);
  };
  const handleConfirmDelete = async () => {
    try {
      let res = await deleteUserTable(selectedUser._id);
      if (res?.EC === 0) {
        toast.success(`user delete ${selectedUser.name}`);
        setShowModal();
        setSelectedUser(null);
        handleGetUserTable();
      } else {
        toast.error(res?.Mes);
      }
    } catch (e) {
      toast.error("Delete Error");
    }
  };
  const handleCancelDelete = () => {
    setShowModal();
    setSelectedUser(null);
    toast.info("Cancel action Delete");
  };
  return (
    <>
      <h2 style={{ textAlign: "center" }}>TABLE USER</h2>
      <Table
        columns={columns}
        dataSource={dataWithKey}
        size="larger"
        pagination={{
          current: currentPages,
          pageSize: 6,
          position: ["bottomCenter"],
          total: totalPages * 6,
          onChange: (page) => setCurrentPages(page),
        }}
      />
      {showModal && (
        <div className="alert-warning">
          <Alert
            className="alert-d"
            message="Warning"
            description="This is a warning notice about copywriting."
            type="warning"
            showIcon
            action={
              <Space direction="vertical">
                <Button
                  size="small"
                  type="primary"
                  onClick={handleConfirmDelete}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  danger
                  ghost
                  onClick={() => handleCancelDelete()}
                >
                  Decline
                </Button>
              </Space>
            }
          />
        </div>
      )}
    </>
  );
};
export default TableUser;
