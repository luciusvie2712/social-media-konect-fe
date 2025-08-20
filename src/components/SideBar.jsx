import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import actiontypes from "../store/Action/ActionTypes"
import avatar from '../assets/download.png'
import '../assets/styles/SideBar.scss'
import bigLogo from '../assets/image/big_logo.jpg'
import smallLogo from '../assets/image/small_logo.jpg'

const SideBar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { account, isauthentic } = useSelector((state) => state.user)

    // const handleLogout = () => {
    //     dispatch({type: actiontypes.USER_LOGOUT})
    //     navigate("/")
    // }

    return (
        <div className="sidebar-container">
            <div className="sidebar__option">
                <div className="sidebar__logo">
                    <picture>
                        <source srcSet={smallLogo} media="(max-width: 1260px)" />
                        <img src={bigLogo} alt="Logo" className="logo" />
                    </picture>
                </div>
                <div className="sidebar__option-item">
                    <i className="fa-solid fa-house w-[25px]"></i>
                    <div className="option-title">Trang chủ</div>
                </div>
                <div className="sidebar__option-item">
                    <i className="fa-solid fa-users w-[25px]"></i>
                    <div className="option-title">Bạn bè</div>
                </div>
                <div className="sidebar__option-item">Chuc nang 4</div>
            </div>
            <div className="sidebar__menu">
                <div className="sidebar__menu-option">
                    <img 
                        onClick={() => navigate('/user')}
                        src={account.avatar ||  avatar} 
                        className="avatar-user"
                    />
                    <div className="option-title">Trang cá nhân</div>
                </div>
               <div className="sidebar__menu-option">
                    <i className="fa-solid fa-bars w-[25px]"></i>
                    <div className="option-title">Tùy chọn</div>
               </div>
            </div>
            
        </div>
    )
}

export default SideBar