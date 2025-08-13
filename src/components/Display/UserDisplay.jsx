import { Routes, Route } from "react-router-dom"
import AuthPage from "../../views/auth/AuthPage"
import UserHomePage from "../../views/user/UserHomePage"


const DisplayUserPage = () => {
    return (
        <div className="max-w-100vw flex h-screen items-center ">
            <Routes>
                <Route path="/" element={<UserHomePage />} />
                <Route path="/auth" element={<AuthPage />} />
            </Routes>

        </div>
    )
}

export default DisplayUserPage