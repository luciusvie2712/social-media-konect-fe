import { Routes, Route, Navigate } from "react-router-dom";
import PrivitaRoute from "../utils/PrivateRoute";
import AuthLayout from "../components/layout/AuthLayout";
import AuthPage from "../views/auth/AuthPage";
import ForgotPage from "../views/auth/ForgotPage";
import ResetPassword from "../views/auth/ResetPassword";
import DisplayLayout from "../components/layout/DisplayLayout";
import HomePage from "../views/user/HomePage";
import ProfilePage from "../views/user/ProfilePage";
import GoogleCallback from "../components/Auth/GoogleCallback";
import Message from "../components/Message/Message";
import FriendPage from "../views/user/FriendPage";
import FriendDetail from "../views/user/FriendDetail";

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

      {/* User routes */}
      <Route
        path="/*"
        element={
          <PrivitaRoute>
            <DisplayLayout />
          </PrivitaRoute>
        }
      >
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<HomePage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="message-box" element={<Message />} />
        <Route path="friends" element={<FriendPage />} />
        <Route path="friends/:type" element={<FriendDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
