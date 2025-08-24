import SideBar from "../../components/SideBar"
import Display from "../../components/Display/Display"

const HomePage = ( ) => {
    return (
        <div className="flex flex-col w-[100%] h-full">
            <SideBar />
            <Display />
        </div>
    )
}

export default HomePage