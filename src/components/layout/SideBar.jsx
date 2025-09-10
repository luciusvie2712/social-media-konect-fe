import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import actiontypes from "../../store/Action/ActionTypes"
import avatar from '../../assets/download.png'
import '../../assets/styles/SideBar.scss'
import bigLogo from '../../assets/image/big_logo.jpg'
import smallLogo from '../../assets/image/small_logo.jpg'
import * as action from '../../store/Export'
import { useState } from "react"
import CreatePostModal from "../Modal/createPost.modal"

const SideBar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { account, isauthentic } = useSelector((state) => state.user)
    const [ isOpen, setIsOpen ] = useState(false)

    const handleLogout = () => {
        dispatch(action.logoutUser())
        navigate("/auth")
    }

    const openModalCreatePost = () => {
        setIsOpen(true)
    }

    return (
        <div className="sidebar-container">
            <div className="sidebar__option">
                <div className="sidebar__logo">
                    <picture>
                        <source srcSet={smallLogo} media="(max-width: 1260px)" />
                        <img src={bigLogo} alt="Logo" className="logo" />
                    </picture>
                </div>
                <NavLink to={`/home`} className="sidebar__option-item">
                    <i className="fa-solid fa-house w-[25px]"></i>
                    <div className="option-title">Trang chủ</div>
                </NavLink>
                <div className="sidebar__option-item">
                    <i className="fa-solid fa-users w-[25px]"></i>
                    <div className="option-title">Bạn bè</div>
                </div>
                <div className="sidebar__option-item">
                    <i className="fa-solid fa-magnifying-glass w-[25px]"></i>
                    <div className="option-title">Tìm kiếm</div>
                </div>
                <div className="sidebar__option-item">
                    <i className="fa-solid fa-bell w-[25px]"></i>
                    <div className="option-title">Thông báo</div>
                </div>
                <div className="sidebar__option-item">
                    <i className="fa-solid fa-paper-plane w-[25px]"></i>
                    <div className="option-title">Tin nhắn</div>
                </div>
                <div className="sidebar__option-item" onClick={openModalCreatePost}>
                    <i className="fa-regular fa-square-plus w-[25px]"></i>
                    <div className="option-title">Tạo mới</div>
                </div>
            </div>
            <div className="sidebar__menu">
                <NavLink to={`/profile/${account?.id}`} className="sidebar__menu-option">
                    <img 
                        src={account?.avatar ||  avatar} 
                        className="avatar-user"
                    />
                    <div className="option-title">Trang cá nhân</div>
                </NavLink>
               <div className="sidebar__menu-option">
                    <i className="fa-solid fa-bars w-[25px]"></i>
                    <div className="option-title" onClick={handleLogout}>Tùy chọn</div>
               </div>
            </div>
            {isOpen && <CreatePostModal isOpen={isOpen} setIsOpen={setIsOpen} account={account} />}
        </div>
        
    )
}

export default SideBar