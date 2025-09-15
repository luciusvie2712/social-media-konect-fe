import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"


const DisplayLayout = () => {
    return (
        <div className="flex w-screen h-screen">
            <SideBar />
            <div className="w-[85%] flex flex-col text-white px-2">
                <Outlet />
            </div>
        </div>
    )
}

export default DisplayLayout