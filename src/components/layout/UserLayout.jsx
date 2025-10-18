import { Outlet, useLocation } from "react-router-dom"
import SideBar from "./SideBar"


const UserLayout = () => {
    const location = useLocation();
    const isFriendList = /^\/friends\/(request|suggestion|all)/.test(location.pathname);

    return (
        <div className="flex w-screen h-screen items-center">
            <SideBar />
            <div className={`flex flex-col text-white px-2 ${isFriendList ? "w-[95%]" : "w-[85%]"}`}>
                <Outlet />
            </div>
        </div>
    )
}

export default UserLayout