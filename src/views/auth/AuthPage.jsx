import { useState } from "react";
import LoginForm from "../../components/Auth/LoginForm";
import RegisterForm from "../../components/Auth/RegisterForm";

const AuthPage = () => {
  const [formType, setFormType] = useState("login");

  return (
    <div className="flex items-center justify-center h-screen  bg-gradient-to-br from-blue-50 to-indigo-100 relative w-screen">
      {formType === "login" ? (
        <LoginForm setFormType={setFormType} />
      ) : (
        <RegisterForm setFormType={setFormType} />
      )}
    </div>
  );
};

export default AuthPage;
