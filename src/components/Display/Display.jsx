import { Routes, Route } from "react-router-dom"
import AuthPage from "../../views/auth/AuthPage"
import HomePage from "../../views/user/HomePage"


const Display = () => {
    return (
        <div className="max-w-100vw flex h-screen items-center ">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
        </div>
    )
}

export default Display