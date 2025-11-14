import avatar from "../../assets/download.png"

const ShowListFriends = ({item, typeList, index, onSelect}) => {
    return (
        <div key={index} onClick={onSelect} className="w-full flex items-center gap-2 hover:bg-blue-200 cursor-pointer py-2 px-2 rounded">
            <img src={item.avatar || avatar} className="w-[45px] rounded-full" />
            <div className="flex flex-col items-center w-full">
                <div className="flex text-[15px] w-full justify-between">
                    <div className="font-medium">{item.name}</div>
                    <div className="opacity-45">2 tuần</div>
                </div>
                <div className="flex items-center w-full gap-2 text-[15px]">
                    {typeList === "request" && (
                        <>
                            <button className="w-[calc(100%/2)] bg-[#4a4aef] rounded">
                                Xác nhận
                            </button>
                            <button className="w-[calc(100%/2)] bg-[#6464646d] rounded">
                                Từ chối
                            </button>
                        </>
                        
                    )} 
                    {typeList === "suggestion" && (
                        <>
                            <button className="w-[calc(100%/2)] bg-[#4a4aef] rounded">
                                Thêm bạn bè
                            </button>
                            <button className="w-[calc(100%/2)] bg-[#6464646d] rounded">
                                Từ chối
                            </button>
                        </>
                    )}
                    {typeList === "all" && (
                        <></>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ShowListFriends
