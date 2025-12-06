import { useState } from "react";
import bgDemo from "../../assets/image/bg_image_profile_2.jpg";
import PostActive from "./PostActive";
import AboutActive from "./AboutActive";
import FriendActive from "./FriendActive";
import { useFriendList } from "../../hook/useFriendList";

const DisplayProfile = ({ info, mode }) => {
    const [activeTab, setActiveTab] = useState("posts");
    const { friends } = useFriendList("all", info.id);

    return (
        <div className="w-full h-full flex flex-col items-center gap-4">
            <div className="w-full bg-[#fafafa] flex flex-col items-center pb-4 shadow-sm">
                <div className="w-[70%] h-60 rounded-xl overflow-hidden">
                    <img
                        src={info?.background || bgDemo}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="w-[70%] flex items-center gap-4 px-5 relative">
                    <img
                        src={info?.avatar}
                        alt="avatar"
                        className="w-[110px] h-[110px] rounded-full object-cover border-4 border-white -mt-12 shadow-md"
                    />

                    <div className="flex flex-col mt-3">
                        <b className="text-[22px]">{info?.name}</b>
                        {info?.email && (
                            <span className="text-gray-600 text-[15px] font-light">
                                {info.email}
                            </span>
                        )}
                        <span className="text-gray-600 text-[16px] font-light">
                            15 bài viết • {friends?.length || 0} bạn bè
                        </span>
                    </div>

                    <div className="ml-auto! flex items-center gap-3">
                        {mode === "owner" && (
                            <button className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-[16px] hover:bg-blue-600 transition">
                                Chỉnh sửa thông tin
                            </button>
                        )}
                        {mode === "all" && (
                            <button className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-[16px] hover:bg-blue-600 transition">
                                Nhắn tin
                            </button>
                        )}
                        {mode === "suggestion" && (
                            <button className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-[16px] hover:bg-blue-600 transition">
                                Thêm bạn bè
                            </button>
                        )}
                        {mode === "request" && (
                            <>
                                <button className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-[16px] hover:bg-blue-600 transition">
                                    Chấp nhận
                                </button>
                                <button className="bg-gray-200 text-black font-medium px-4 py-2 rounded-lg text-[16px] hover:bg-gray-300 transition">
                                    Từ chối
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="w-[70%] flex items-center gap-6 border-t border-gray-300 mt-3 pt-3">
                    {["posts", "about", "friend"].map((tab) => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-2 pb-1 text-[17px] font-medium cursor-pointer transition 
                            ${
                                activeTab === tab
                                    ? "border-b-2 border-blue-500 text-blue-600"
                                    : "border-b-2 border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300"
                            }`}
                        >
                            {tab === "posts" && "Bài viết"}
                            {tab === "about" && "Giới thiệu"}
                            {tab === "friend" && "Bạn bè"}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-[70%] flex gap-4">
                    {activeTab === "posts" && <PostActive userId={info?.id} friends={friends} />}
                    {activeTab === "about" && <AboutActive />}
                    {activeTab === "friend" && <FriendActive friends={friends} />}
                </div>
            </div>
        </div>
    );
};

export default DisplayProfile;
