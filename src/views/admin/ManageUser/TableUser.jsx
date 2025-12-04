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
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          name
        </span>
      ),
      render: (_, record) => (
        <Tag color="blue">
          <span style={{ fontSize: "15px", fontWeight: "500" }}>
            {record.name || ""}
          </span>
        </Tag>
      ),
      key: "name",
    },
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          email
        </span>
      ),
      render: (_, record) => (
        <p style={{ color: "#7e7e7eff" }}>{record?.email}</p>
      ),
      key: "Email",
    },
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          Join Date
        </span>
      ),
      render: (_, record) => {
        let time = new Date(record.createdAt);
        let formattedTime = time.toLocaleDateString("en-GB");
        return <p style={{ color: "#7e7e7eff" }}>{formattedTime} </p>;
      },
      key: "createdAt",
    },
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          status
        </span>
      ),
      render: (_, record) => {
        let bg = "#d9d9d9";
        let cl = "black";
        if (record.statusAccount === "active")
          (bg = "#8dc28ed8"), (cl = "green");
        if (record.statusAccount === "banned") (bg = "#c88d8eff"), (cl = "red");

        return (
          <p
            style={{
              backgroundColor: bg,
              color: cl,
              padding: "2px 10px",
              borderRadius: "8px",
              width: "fit-content",
              textTransform: "capitalize",
            }}
          >
            {record.statusAccount}
          </p>
        );
      },
      key: "statusAccount",
    },
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          role
        </span>
      ),
      render: (_, record) => (
        <p style={{ fontWeight: "500" }}>{record?.roleId}</p>
      ),
      key: "roleId",
    },
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          action
        </span>
      ),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            style={{
              color: "rgba(230, 227, 227, 1)",
              fontSize: "15px",
              borderRadius: "8px",
              padding: "4px 10px",
              backgroundColor: "rgba(180, 30, 200, 1)",
            }}
            onClick={() => handleEditUser(record)}
          >
            BanAccount
          </a>
          <a
            style={{
              color: "rgba(230, 227, 227, 1)",
              fontSize: "15px",
              borderRadius: "8px",
              padding: "4px 10px",
              backgroundColor: "rgba(225, 57, 42, 1)",
            }}
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
      <h2 style={{ fontWeight: "bold" }}>Account Management</h2>
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
