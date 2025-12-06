const FriendActive = ({ friends }) => {
    return (
        <div className="w-full flex flex-col gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="w-full flex justify-between items-center">
                <span className="text-xl font-semibold">Bạn bè</span>
                <input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none text-sm"
                />
            </div>

            {friends.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {friends.map((f, idx) => (
                        <div
                            key={idx}
                            className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition shadow-sm"
                        >
                            <div className="flex gap-3 items-center">
                                <img
                                    src={f.avatar}
                                    alt=""
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                                <span className="text-[18px] font-medium">{f.name}</span>
                            </div>

                            <div className="flex gap-2 items-center">
                                <button className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                    Xem trang cá nhân
                                </button>
                                <button className="bg-gray-200 text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                                    Nhắn tin
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full flex justify-center items-center h-[300px] text-xl opacity-50">
                    <span>Chưa có bạn bè</span>
                </div>
            )}
        </div>
    )
}

export default FriendActive
