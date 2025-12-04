import { use, useEffect, useState } from "react";
import "./AdminPage.scss";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const AdminPages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);
  const avatar = useSelector((state) => state.user?.account?.avatar);

  return (
    <>
      <div className="admin-container">
        <div className="admin-content">
          <div className="content-left">
            <span>
              <Link to="/home" className="return-button">
                <i className="fa-solid fa-house-user"></i>
                <span>return home</span>
              </Link>
            </span>
            <div className="admin-header">
              <img src={avatar} alt="" />
              <h3>Admin Panel</h3>
              <p>Social Network Inc.</p>
            </div>

            <div
              className={
                activePath === "/admin/Manage-User"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => navigate("/admin/Manage-User")}
            >
              <i className="icon-user"></i>
              <span>
                <i className="fa-solid fa-users mx-2"></i>Account Management
              </span>
            </div>

            <div
              className={
                activePath === "/admin/Manage-Post"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => navigate("/admin/Manage-Post")}
            >
              <i className="icon-post"></i>
              <span>
                <i className="fa-solid fa-book-open-reader mx-2"></i>Post
                Management
              </span>
            </div>

            <div
              className={
                activePath === "/admin/Manage-Logo"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => navigate("/admin/Manage-Logo")}
            >
              <i className="icon-settings"></i>
              <span>
                <i className="fa-solid fa-gear mx-2"></i>Website Settings
              </span>
            </div>
          </div>

          <div className="content-right">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminPages;
