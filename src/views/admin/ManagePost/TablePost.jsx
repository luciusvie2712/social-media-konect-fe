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
import {
  deletePost,
  handleProcessReportPost,
} from "../../../utils/api.customize";
import { useEffect, useState } from "react";
import imgdefault from "../../../assets/image/imagedefault.jpg";
import { useSelector } from "react-redux";
const TablePost = (props) => {
  const {
    listPostTable,
    currentPages,
    setCurrentPages,
    totalPages,
    handleGetPostTable,
    showModal,
    setShowModal,
    handleShowDetailPost,
    handleShowDetailImage,
  } = props;
  const userId = useSelector((state) => state.user.account.id);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModalReport, setShowModalReport] = useState(false);
  const [dataReport, setDataReport] = useState();
  const [dataProcessReport, setDataProcessReport] = useState({
    postId: "",
    action: " ",
    userId: "",
  });
  useEffect(() => {
    if (userId) {
      setDataProcessReport((prev) => ({
        ...prev,
        userId: userId,
      }));
    }
  }, []);
  const columns = [
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          id
        </span>
      ),

      render: (_, record) => (
        <p style={{ color: "#7e7e7eff" }}>{record?._id}</p>
      ),
      key: "_id",
    },
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          Author name
        </span>
      ),
      render: (_, record) => (
        <Tag color="blue">
          <span style={{ fontSize: "15px", fontWeight: "500" }}>
            {record.author?.name || ""}
          </span>
        </Tag>
      ),
      key: "author",
    },
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          Media
        </span>
      ),
      key: "media",
      render: (_, record) => (
        <div
          onClick={() => handleShowDetailImage(record)}
          className="cursor-pointer flex justify-center"
        >
          {record.media && record.media.length > 0 ? (
            <img
              src={imgdefault}
              className="w-10 h-10 object-cover rounded-md"
            />
          ) : (
            <img
              src={imgdefault}
              className="w-10 h-10 object-cover opacity-50 rounded-md"
            />
          )}
        </div>
      ),
    },
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          Caption
        </span>
      ),
      render: (_, record) => (
        <p
          style={{
            maxWidth: "250px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: 0,
          }}
        >
          {record.caption || "asd"}
        </p>
      ),
      key: "caption",
    },
    {
      title: (
        <span style={{ textTransform: "uppercase", color: "#7e7e7eff" }}>
          reports
        </span>
      ),
      render: (_, record) => {
        let tagColor = "green";

        if (record.reports?.length > 0) {
          const hasPending = record.reports.some(
            (item) => item.status === "pending"
          );
          const allReviewed = record.reports.every(
            (item) => item.status === "reviewed"
          );

          if (hasPending) {
            tagColor = "red";
          } else if (allReviewed) {
            tagColor = "gold";
          } else {
            tagColor = "red";
          }
        }

        return (
          <Tag
            className="cursor-pointer flex justify-center"
            color={tagColor}
            onClick={() => handleViewReport(record)}
          >
            {record.reports?.length || 0}
          </Tag>
        );
      },
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
            style={{ color: "rgb(233, 185, 38)", fontSize: "15px" }}
            onClick={() => handleShowDetailPost(record)}
          >
            ....
          </a>
          <a
            style={{ color: "#edededff", fontSize: "15px" }}
            onClick={() => handleDeletePost(record._id)}
          >
            <span
              style={{
                color: "rgba(230, 227, 227, 1)",
                fontSize: "15px",
                borderRadius: "8px",
                padding: "4px 10px",
                backgroundColor: "rgba(180, 30, 200, 1)",
              }}
            >
              Delete
            </span>
          </a>
        </Space>
      ),
    },
  ];
  const handleViewReport = (data) => {
    if (data.reports.length < 1) return;
    setDataProcessReport((prev) => ({
      ...prev,
      postId: data?._id,
    }));
    setShowModalReport(true);
    setDataReport(data.reports);
  };
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
  const handleReport = async (action) => {
    try {
      const payload = {
        ...dataProcessReport,
        action,
      };
      const response = await handleProcessReportPost(payload);
      if (response?.Ec === 0) {
        setDataProcessReport((prev) => ({
          ...prev,
          postId: "",
          action: " ",
          userId: "",
        }));
        handleGetPostTable();
        setShowModalReport(false);
        toast.success(response.Mes);
      } else {
        toast.error(response?.Mes);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h2 style={{ fontWeight: "bold" }}>Post Management</h2>
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
      <Modal
        open={showModalReport}
        onCancel={() => setShowModalReport(false)}
        footer={null}
        width={400}
      >
        {dataReport &&
          dataReport.length > 0 &&
          dataReport.map((item) => {
            return (
              <>
                <div className="report-main" key={item._id}>
                  <span
                    style={{
                      fontSize: "15px",
                      display: "flex",
                    }}
                  >
                    Reason :<p style={{ color: "red" }}>{item.reason}</p>
                  </span>
                </div>
              </>
            );
          })}
        <div
          className="button-handle-report"
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "end",
            marginTop: "20px",
          }}
        >
          <button
            className="btn btn-warning"
            onClick={() => handleReport("reviewed")}
          >
            Reviewed
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleReport("dismissed")}
          >
            dismissed
          </button>
        </div>
      </Modal>
    </>
  );
};
export default TablePost;
