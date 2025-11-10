import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import bigLogo from "../../assets/image/big_logo-removebg-preview.png";
import avatar from "../../assets/download.png";
import * as action from "../../store/Export";
import { useState } from "react";
import NotificationModal from "../Modal/Notification.modal";

const NavBar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { account } = useSelector((state) => state.user)
    const [ openModalNotification, setOpenNotification ] = useState(false)

    const handleLogout = () => {
        dispatch(action.logoutUser())
        navigate("/auth")
    }

    return (
        <div className="fixed top-0 left-0 w-full bg-[#242424] shadow-md z-50 flex items-center justify-between px-4 py-2 text-white">
            <div className="flex items-center">
                <NavLink to="/home">
                    <img src={bigLogo} className="h-10" />
                </NavLink>
            </div>
            <div className="flex-1 max-w-md mx-4">
                <input type="text" placeholder="Tìm kiếm ..." className="" />
            </div>
            <div className="flex items-center space-x-4 gap-4">
                <NavLink to={`/profile/${account?.id}`} className=" ">
                    <img src={account?.avatar || avatar} className="w-8 h-8 rounded-full" />
                </NavLink>
                <button onClick={() => setOpenNotification(true)} className="text-xl">
                    <i className="fa-regular fa-bell"></i>
                </button>
                <NavLink to='/message-box' className="text-xl">
                    <i className="fa-solid fa-paper-plane"></i>
                </NavLink>
                <button className="text-xl">
                    <i className="fa-solid fa-bars"></i> {/* Cài đặt - có thể mở dropdown với logout */}
                </button>
                <button onClick={handleLogout} className="text-xl">
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
            <NotificationModal show={openModalNotification} setShow={setOpenNotification} account={account} />
        </div>
    )
}

export default NavBar