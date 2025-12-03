import { NavLink } from "react-router-dom"

const NavBar = () => {
    return (
        <div className="w-[100%] flex flex-col items-center">
            <div className="w-full text-[20px] font-medium">
                <p>Bạn bè</p>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
                <NavLink style={{ textDecoration: "none" }} to={`/friends/request`} className="w-full flex items-center gap-3 py-2 hover:bg-[#cdcdcd] cursor-pointer rounded px-2 text-black transition-all">
                    <i className="fa-solid fa-user-group w-4"></i>
                    <span>Lời mời kết bạn</span>
                </NavLink>
                <NavLink style={{ textDecoration: "none" }} to={`/friends/suggestion`} className="w-full flex items-center gap-3 py-2 hover:bg-[#cdcdcd] cursor-pointer rounded px-2 text-black transition-all">
                    <i className="fa-solid fa-user-plus w-4"></i>
                    <span>Gợi ý kết bạn</span>
                </NavLink>
                <NavLink style={{ textDecoration: "none" }} to={`/friends/all`} className="w-full flex items-center gap-3 py-2 hover:bg-[#cdcdcd] cursor-pointer rounded px-2 text-black transition-all">
                    <i className="fa-solid fa-address-book w-4"></i>
                    <span>Tất cả bạn bè</span>
                </NavLink>
                <div className="w-full flex items-center gap-3 py-2 hover:bg-[#cdcdcd] cursor-pointer rounded px-2 transition-all">
                    <i className="fa-solid fa-user-check w-4"></i>
                    <span>Lời mời đã gửi</span>
                </div>
            </div>
        </div>
    )
}

export default NavBar