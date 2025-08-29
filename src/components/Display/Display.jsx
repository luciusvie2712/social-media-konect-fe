import { Routes, Route, Navigate } from "react-router-dom"
import DisplayHome from "./DisplayHome"
import DisplayProfile from "./DisplayProfile"

const Display = () => {
    return (
        <div className="w-[85%] flex flex-col h-screen justify-center items-center px-5 bg-black text-white">
            <Routes>
                <Route path="/" element={<Navigate to="home" />} />
                <Route path="home" element={<DisplayHome />} />
                <Route path="profile/:id" element={<DisplayProfile />} />
            </Routes>
        </div>
    )
}

export default Display
