import { useState } from "react";
import bgDemo from "../../assets/image/bg_image_profile_2.jpg";
import PostActive from "./PostActive";
import AboutActive from "./AboutActive";
import FriendActive from "./FriendActive";

const DisplayProfile = ({ info, mode }) => {
    console.log("Info: ", info)
    const [activeTab, setActiveTab] = useState('posts')
    return (
        <div className="w-full h-full flex flex-col items-center rounded gap-4">
            <div className="w-full bg-[#fbf9f9] flex flex-col items-center gap-4 pb-2">
                <div className="w-[70%] h-60 flex justify-center">
                    <img src={info?.background || bgDemo} className="w-full object-cover" />
                </div>
                <div className="w-[70%] flex items-center gap-2 px-5">
                     <img
                        src={info?.avatar}
                        alt="avatar"
                        className="w-[10%] rounded-full object-cover border-4 border-white -mt-10"
                    />

                    <div className="flex flex-col">
                        <b className="text-[20px]">{info?.name}</b>
                        {info?.email && <span className="text-gray-600 text-[15px]! font-light!">{info.email}</span>}
                        <span className="text-gray-600 text-[17px]! font-light!">15 bài viết • 20 bạn bè</span>
                    </div>

                    <div className="ml-auto! flex items-center gap-3">
                        {mode === "owner" && (
                            <button className="bg-blue-400 text-white font-medium px-2 py-2 rounded text-[18px]! hover:opacity-80"> Chỉnh sửa thông tin</button>
                        )}
                        {mode === "all" && (
                            <button className="bg-blue-400 text-white font-medium px-2 py-2 rounded text-[18px]! hover:opacity-80">Nhắn tin</button>
                        )}
                        {mode === "suggestion" && (
                            <button className="bg-blue-400 text-white font-medium px-2 py-2 rounded text-[18px]! hover:opacity-80">Thêm bạn bè</button>
                        )}
                        {mode === "request" && (
                            <>
                                <button className="bg-blue-400 text-white font-medium px-2 py-2 rounded text-[18px]! ">Chấp nhận</button>
                                <button className="bg-gray-300 text-black font-medium px-3 py-2 rounded text-[18px]! ">Từ chối</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="w-[70%] flex items-center gap-4 border-t-1 border-[#cdcdcd] py-3">
                    <div 
                        onClick={() => setActiveTab('posts')}
                        className={`flex justify-center items-center border-[#e5e5e5] px-2 text-[18px] cursor-pointer ${activeTab === "posts" ? "border-b-3 border-blue-400 text-blue-600" : "border-b-3 border-transparent hover:border-blue-400"}`}
                    >
                        Bài viết
                    </div>
                    <div 
                        onClick={() => setActiveTab('about')}
                        className={`flex justify-center items-center border-[#e5e5e5] px-2 text-[18px] cursor-pointer ${activeTab === "about" ? "border-b-3 border-blue-400 text-blue-600" : "border-b-3 border-transparent hover:border-blue-400"}`}
                    >
                        Giới thiệu
                    </div>
                    <div 
                        onClick={() => setActiveTab('friend')}
                        className={`flex justify-center items-center border-[#e5e5e5] px-2 text-[18px] cursor-pointer ${activeTab === "friend" ? "border-b-3 border-blue-400 text-blue-600" : "border-b-3 border-transparent hover:border-blue-400"}`}
                    >
                        Bạn bè
                    </div>
                </div>
            </div>
            <div className="w-[100%] flex justify-center py-2">
                <div className="w-[70%] flex gap-4">
                    {activeTab === "posts" && (
                        <PostActive />
                    )}
                    {activeTab === "about" && (
                        <AboutActive />
                    )}
                    {activeTab === "friend" && (
                        <FriendActive />
                    )}
                </div>
            </div>
            
        </div>
    )
}

export default DisplayProfile