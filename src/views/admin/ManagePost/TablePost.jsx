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
import { deletePost } from "../../../utils/api.customize";
import { useState } from "react";
const TablePost = (props) => {
  const {
    listPostTable,
    currentPages,
    setCurrentPages,
    totalPages,
    handleGetPostTable,
    showModal,
    setShowModal,
  } = props;

  const [selectedPost, setSelectedPost] = useState(null);
  const columns = [
    {
      title: "ID",
      render: (_, record) => <p>{record?._id}</p>,
      key: "_id",
    },
    {
      title: "Author name",
      render: (_, record) => (
        <Tag color="green">{record.author?.name || 0}</Tag>
      ),
      key: "author",
    },
    {
      title: "Media",
      dataIndex: "phoneNumber",
      key: "media",
    },
    {
      title: "caption",
      dataIndex: "caption",
      key: "caption",
    },
    {
      title: "reports",
      render: (_, record) => (
        <Tag color="red">{record.reports?.length || 0}</Tag>
      ),
      key: "reports",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a style={{ color: "rgb(233, 185, 38)", fontSize: "15px" }}>....</a>
          <a
            style={{ color: "red", fontSize: "15px" }}
            onClick={() => handleDeletePost(record._id)}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];
  //tailwind 2 cai the a cho dep dum`
  const dataWithKey = listPostTable?.map((item, index) => ({
    key: item._id || index,
    ...item,
  }));

  const handleDeletePost = async (postId) => {
    setShowModal();
    setSelectedPost(postId);
  };
  const handleConfirmDelete = async () => {
    try {
      let res = await deletePost(selectedPost);
      if (res?.Ec === 0) {
        setShowModal();
        setSelectedPost(null);
        handleGetPostTable();
      } else {
        toast.error(res?.Mes);
      }
    } catch (e) {
      toast.error("Delete Error");
    }
  };
  const handleCancelDelete = () => {
    setShowModal();
    setSelectedPost(null);
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
          pageSize: 8,
          position: ["bottomCenter"],
          total: totalPages * 8,
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
export default TablePost;
