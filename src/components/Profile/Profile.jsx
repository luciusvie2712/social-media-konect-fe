import { useState } from "react"

const Profile = ({data}) => {
    const [active, setActive] = useState("BÀI VIẾT")
    const tabs = ["BÀI VIẾT", "ẢNH", "GIỚI THIỆU", "VIDEO"]
    return (
        <div className="w-full h-screen overflow-auto flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center justify-center py-5 bg-[#6c6c6c79]">
                <img src={data.avatar} className="w-[100px] rounded-full" />
                <div className="mt-3 text-[20px] font-medium">
                    {data.name}
                </div>
                <div className="text-[12px] opacity-65 flex items-center gap-2">
                    <div className="inline-block">2k <b > người theo dõi</b></div>
                    <i className="fa-solid fa-circle text-[5px]"></i>
                    <div className=""><b>Đang theo dõi</b> 100 </div>
                </div>
                <div className="flex items-center gap-5 mt-4">
                    <button className="font-medium text-[15px] bg-[#5f7cfd] px-4 py-1 rounded flex gap-2 items-center"><i className="fa-solid fa-user-check"></i>Xác nhận</button>
                    <button className="font-medium text-[15px] bg-[#494949] px-4 py-1 rounded flex gap-2 items-center"><i className="fa-solid fa-message"></i>Nhắn tin</button>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-10">
                {tabs.map((tab) => (
                    <div
                    key={tab}
                    onClick={() => setActive(tab)}
                    className={`relative font-medium text-[15px] cursor-pointer py-3 transition 
                        ${active === tab ? "text-white" : "text-[#cccccc] hover:text-white"}`}
                    >
                    {tab}
                    {active === tab && (
                        <span className="absolute left-0 -bottom-[2px] w-full h-[2px] bg-white rounded transition-all duration-300"></span>
                    )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Profile