import { useEffect, useState } from "react";
import "./AdminDashboard.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  getAdminSummary,
  getPostStats,
  getUserStats,
} from "../../utils/api.customize";
import { get } from "lodash";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [userStats, setUserStats] = useState([]);
  const [postStats, setPostStats] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const s = await getAdminSummary();
    if (s?.Ec === 0) setSummary(s.data);

    const u = await getUserStats();
    if (u?.Ec === 0) setUserStats(formatData(u.data));

    const p = await getPostStats();
    if (p?.Ec === 0) setPostStats(formatData(p.data));
  };

  const formatData = (data) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return data.map((item) => ({
      month: months[item._id - 1],
      total: item.total,
    }));
  };

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <div className="card-stat">
          <h3>👥 Total Users</h3>
          <p>{summary.totalUsers}</p>
        </div>

        <div className="card-stat">
          <h3>📝 Total Posts</h3>
          <p>{summary.totalPosts}</p>
        </div>
      </div>
      <div style={{ marginTop: "40px" }}>
        <h2>User Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Post Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={postStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Không set màu — để cho thư viện tự chọn */}
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
