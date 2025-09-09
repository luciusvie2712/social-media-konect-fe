import "./App.css";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import AuthPage from "./views/auth/AuthPage";
import HomePage from "./views/user/HomePage";
import ForgotPage from "./views/auth/ForgotPage";
import ResetPassword from "./views/auth/ResetPassword";
import SideBar from "./components/SideBar";
import GoogleCallback from "./components/Auth/GoogleCallback";

function App() {
  return (
    <Routes>
      {/* Auth layout */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPage />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/auth/google/callback/:session_id"
        element={<GoogleCallback />}
      />
      {/* User layout */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
