import { Outlet } from "react-router-dom"

const AuthLayout = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-[#ccc] relative w-screen">
            <Outlet />
        </div>
    )
}

export default AuthLayout