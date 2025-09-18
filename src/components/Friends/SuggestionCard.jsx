
const SuggestionCard = ({index, item}) => {
    return (
        <div key={index} className="w-[180px] border-1 border-[#242424] rounded flex flex-col items-center cursor-pointer">
            <img src={item.avatar} className="rounded-t-[4px]"/>
            <div className="w-full flex flex-col item-center pt-2">
                <span className="text-[15px] font-semibold px-2">{item.name}</span>
                <span className="text-[13px] px-2 opacity-50">{item.mutualFriends} bạn chung</span>
            </div>
            <div className="flex flex-col w-full items-center gap-2 text-[15px] mt-2 mb-2 px-2">
                <button className="bg-[#3416bc43] font-semibold py-1 rounded w-full hover:bg-[#6751c95b] text-blue-400">
                    Thêm bạn bè
                </button>
                <button className="bg-[#4c4c4c86] font-semibold py-1 rounded w-full hover:bg-[#76767686]">
                    Gỡ/Xóa
                </button>
            </div>
        </div>
    )
}

export default SuggestionCard