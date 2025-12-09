const FriendActive = ({ friends, loading = false }) => {
  return (
    <div className="w-full flex flex-col gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Header with search */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-3 md:gap-0">
        <div className="flex items-center gap-2">
          <span className="text-[18px] lg:text-[18px]! font-bold text-black flex items-center gap-2 opacity-100">
            <i className="fa-solid fa-user-group"></i>
            Bạn bè
          </span>
          {friends?.length > 0 && (
            <span className="text-[15px]! text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              {friends.length} bạn bè
            </span>
          )}
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <input
              type="search"
              placeholder="Tìm kiếm bạn bè..."
              className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
            />
            <i className="fa-solid fa-magnifying-glass absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
        </div>
      </div>

      {/* Friends list */}
      {loading ? (
        <div className="w-full flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Đang tải danh sách bạn bè...</p>
          </div>
        </div>
      ) : !friends || friends.length === 0 ? (
        <div className="w-full flex flex-col justify-center items-center h-64 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4!">
            <i className="fa-solid fa-user-group text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có bạn bè</h3>
          <p className="text-gray-500 text-sm max-w-md">
            Khi có bạn bè, họ sẽ xuất hiện ở đây. Hãy kết nối với mọi người để xem bạn bè của họ!
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3 px-2">
          {/* Friends grid */}
            {friends.map((friend, idx) => (
              <div
                key={friend.id || idx}
                className="w-full flex flex-col sm:flex-row justify-between items-center px-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-sm border border-gray-200 hover:border-gray-300"
              >
                {/* Friend info */}
                <div className="flex items-center gap-3 px-2 py-2">
                    <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-14 h-14 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                        <span className="text-[16px] lg:text-[17px] font-semibold text-gray-900 opacity-100">
                        {friend.name}
                        </span>
                        {friend.mutualFriends > 0 ? (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <i className="fa-solid fa-user-group text-xs text-gray-400"></i>
                            {friend.mutualFriends} bạn chung
                        </p>
                        ) : friend.location ? (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <i className="fa-solid fa-location-dot text-xs text-gray-400"></i>
                            {friend.location}
                        </p>
                        ) : friend.work ? (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <i className="fa-solid fa-briefcase text-xs text-gray-400"></i>
                            {friend.work}
                        </p>
                        ) : null}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none bg-blue-600 text-white font-medium px-2 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <i className="fa-solid fa-user text-xs"></i>
                    <span className="hidden lg:inline text-[16px]! opacity-100">Trang cá nhân</span>
                    <span className="lg:hidden text-[16px]! opacity-100">Xem</span>
                  </button>
                  <button className="flex-1 sm:flex-none bg-white text-gray-700 font-medium px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <i className="fa-solid fa-message text-xs"></i>
                    <span className="hidden lg:inline text-[16px]! opacity-100">Nhắn tin</span>
                    <span className="lg:hidden text-[16px]! opacity-100">Chat</span>
                  </button>
                </div>
              </div>
            ))}


          {/* Load more */}
          {friends.length > 8 && (
            <div className="pt-4 mt-2 border-t border-gray-200 flex justify-center">
              <button className="px-5 py-2.5 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
                <i className="fa-solid fa-chevron-down"></i>
                Xem thêm bạn bè
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FriendActive