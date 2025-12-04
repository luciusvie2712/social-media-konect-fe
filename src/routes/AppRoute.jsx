import { Routes, Route, Navigate } from "react-router-dom";
import PrivitaRoute from "../utils/PrivateRoute";
import AuthLayout from "../components/layout/AuthLayout";
import AuthPage from "../views/auth/AuthPage";
import ForgotPage from "../views/auth/ForgotPage";
import ResetPassword from "../views/auth/ResetPassword";
import UserLayout from "../components/layout/UserLayout";
import HomePage from "../views/user/HomePage";
import ProfilePage from "../views/user/ProfilePage";
import GoogleCallback from "../components/Auth/GoogleCallback";
import Message from "../components/Message/Message";
import FriendPage from "../views/user/FriendPage";
import FriendDetail from "../views/user/FriendDetail";
import ManageUser from "../views/admin/ManageUser/ManageUser";
import ManagePost from "../views/admin/ManagePost/ManagePost";
import ManageLogo from "../views/admin/ManageLogo/ManageLogo";
import Pagebanned from "../ErrorPage";
import AdminPages from "../views/admin/AdminPage";
import AdminDashboard from "../views/admin/AdminDashboard";

const AppRoute = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/api/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Route>
      <Route path="/admin" element={<AdminPages />}>
        <Route index element={<AdminDashboard />} />
        <Route path="Manage-User" element={<ManageUser />} />
        <Route path="Manage-Post" element={<ManagePost />} />
        <Route path="Manage-Logo" element={<ManageLogo />} />
      </Route>

      {/* User routes */}
      <Route
        path="/*"
        element={
          <PrivitaRoute>
            <UserLayout />
          </PrivitaRoute>
        }
      >
        <Route path="*" element={<Pagebanned />} />
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<HomePage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="message-box" element={<Message />} />
        <Route path="friends" element={<FriendPage />} />
        <Route path="friends/:type/:friendId?" element={<FriendDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
