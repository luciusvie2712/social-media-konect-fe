    import { useState, useEffect } from "react"
    import LoginForm from "../../components/Auth/LoginForm"
    import RegisterForm from "../../components/Auth/RegisterForm"
    import { useLocation, useNavigate } from "react-router-dom"

    const AuthPage = () => {
        const navigate = useNavigate()
        const location = useLocation()
        const [formType, setFormType] = useState(location.state?.formType || "login");
        useEffect(() => {
            if (location.state?.formType) {
                setFormType(location.state.formType);
            }
        }, [location.state]);

        return (
            <div className="flex items-center justify-center h-screen bg-[#ccc] relative w-screen">
                <div
                    onClick={() => navigate('/')}
                    className="absolute top-5 left-6 cursor-pointer bg-[#3f3c3c51] py-2 px-4 rounded-full hover:translate-x-[-5px] transition"
                >
                    <i className="fa-solid fa-arrow-left w-4"></i>
                </div>
                {formType === "login" ? <LoginForm /> : <RegisterForm />}
            </div>
        )
    }

    export default AuthPage