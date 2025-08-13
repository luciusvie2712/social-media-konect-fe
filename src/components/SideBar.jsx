import { Link, useNavigate } from "react-router-dom"

const SideBar = () => {

    const navigate = useNavigate()
    
    return (
        <div className="w-screen h-[100px] flex  bg-[#242424] items-center text-gray-200 font-medium justify-around">
            <div className="flex items-center gap-6 h-full">
                <div className="cursor-pointer hover:underline underline-offset-1">Chuc nang 1</div>
                <div className="cursor-pointer hover:underline underline-offset-1">Chuc nang 2</div>
            </div>
            <div className="flex gap-4 p-4 h-full">
                <button
                    className="text-white px-4 py-2 rounded"
                    onClick={() => navigate("/auth", { state: { formType: "register" } })}
                >
                    Register
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/auth", { state: { formType: "login" } })}
                >
                    Login
                </button>
            </div>
        </div>
    )
}

export default SideBar