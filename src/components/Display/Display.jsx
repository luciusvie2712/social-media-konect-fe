import { Routes, Route } from "react-router-dom"
// import AuthPage from "../../views/auth/AuthPage"
import LoginForm from '../Auth/LoginForm'
import HomePage from "../../views/user/HomePage"


const Display = () => {
    return (
        <div className="max-w-100vw flex h-screen items-center ">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
            </Routes>
        </div>
    )
}

export default Display