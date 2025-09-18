
const ShowListFriends = ({item, typeList, index}) => {

    return (
        <div key={index} className="w-full flex items-center gap-2 hover:bg-[#242424] cursor-pointer py-2 px-2 rounded">
            <img src={item.avatar} className="w-[45px] rounded-full" />
            <div className="flex flex-col items-center w-full">
                <div className="flex text-[15px] w-full justify-between">
                    <div className="">{item.name}</div>
                    <div className="opacity-45">2 tuần</div>
                </div>
                <div className="flex items-center w-full gap-2 text-[15px]">
                    <button className="w-[calc(100%/2)] bg-[#4a4aef] rounded">
                        {typeList === "request" ? <>Xác nhận</> : <>Thêm bạn bè</>}
                    </button>
                    <button className="w-[calc(100%/2)] bg-[#6464646d] rounded">
                        {typeList === "request" ? <>Xóa</> : <>Gỡ/Xóa</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShowListFriends
