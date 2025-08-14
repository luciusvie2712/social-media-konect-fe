import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import actiontypes from "../store/Action/ActionTypes"
import avatar from '../assets/download.png'

const SideBar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { account, isauthentic } = useSelector((state) => state.user)

    // const handleLogout = () => {
    //     dispatch({type: actiontypes.USER_LOGOUT})
    //     navigate("/")
    // }

    return (
        <div className="w-screen h-[100px] flex  bg-[#242424] items-center text-gray-200 font-medium justify-around">
            <div className="flex items-center gap-6 h-full">
                <div className="cursor-pointer hover:underline underline-offset-1">Chuc nang 1</div>
                <div className="cursor-pointer hover:underline underline-offset-1">Chuc nang 2</div>
            </div>
                {!isauthentic ? (
                    <div className="flex items-center gap-2 p-4 h-full">
                        <button
                            className="text-white px-4 py-2 rounded hover:underline"
                        >
                            Logout
                        </button>
                        <img 
                            src={account.avatar ||  avatar} 
                            className="w-10 h-10 rounded-full object-cover hover:outline-3 outline-blue-300  cursor-pointer"
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-4 p-4 h-full">
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
                )}
        </div>
    )
}

export default SideBar