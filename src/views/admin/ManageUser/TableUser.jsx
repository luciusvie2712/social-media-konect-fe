import { Divider, Space, Table, Tag } from "antd";
import Title from "antd/es/skeleton/Title";
const TableUser = (props) => {
  const {
    listUserTable,
    currentPages,
    setCurrentPages,
    totalPages,
    handleGetUserTable,
  } = props;
  console.log(totalPages);
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a style={{ color: "rgb(233, 185, 38)", fontSize: "15px" }}>
            Invite{" "}
          </a>
          <a style={{ color: "red", fontSize: "15px" }}>Delete</a>
        </Space>
      ),
    },
  ];
  //tailwind 2 cai the a cho dep dum`
  const dataWithKey = listUserTable?.map((item, index) => ({
    key: item._id || index,
    ...item,
  }));

  return (
    <>
      <h2 style={{ textAlign: "center" }}>TABLE USER</h2>
      <Table
        columns={columns}
        dataSource={dataWithKey}
        size="larger"
        pagination={{
          current: currentPages,
          pageSize: 10,
          total: totalPages,
          onChange: (page) => setCurrentPages(page),
        }}
      />
    </>
  );
};
export default TableUser;
