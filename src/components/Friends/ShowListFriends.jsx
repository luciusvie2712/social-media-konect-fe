import { useSelector } from "react-redux";
import avatar from "../../assets/download.png"
import { useFriendRequest } from "../../hook/useFriendRequest";

const ShowListFriends = ({item, typeList, index, onSelect}) => {
    const user = useSelector((state) => state.user.account);
    const { status, handleSendFriendRequest } = useFriendRequest();
        const requesterId = user?.id
        console.log(item)
        const onSendRequest = async () => {
            try {
                await handleSendFriendRequest(requesterId, item._id)
                console.log(">>>>> Da gui loi moi thanh cong")
            } catch (error) {
                console.log(">>>>> Gui loi moi that bai: ", error)
            }
        }
    
    return (
        <div key={index} onClick={onSelect} className="w-full flex items-center gap-2 hover:bg-gray-200 cursor-pointer py-2 px-2 rounded border-b border-gray-200">
            <img src={item.avatar || avatar} className="w-[60px] rounded-full" />
            <div className="flex flex-col items-center w-full gap-2">
                <div className="flex text-[15px] w-full items-center">
                    <div className="font-medium">{item.name}</div>
                </div>
                <div className="flex items-center w-full gap-2 text-[15px]">
                    {typeList === "request" && (
                        <>
                            <button className="w-[calc(100%/2)] bg-blue-400 rounded text-white py-1">
                                Xác nhận
                            </button>
                            <button className="w-[calc(100%/2)] bg-[#6464646d] rounded py-1">
                                Từ chối
                            </button>
                        </>
                        
                    )} 
                    {typeList === "suggestion" && (
                        <>
                            {status === 'idle' ? (
                                <button onClick={onSendRequest} className="w-[calc(100%/2)] bg-blue-400 rounded text-white py-1">
                                    Thêm bạn bè
                                </button>
                            ) : (
                                <button onClick={onSendRequest} className="w-[calc(100%/2)] bg-gray-200 rounded text-black py-1">
                                    Hủy lời mời
                                </button>
                            )}
                            <button className="w-[calc(100%/2)] bg-[#6464646d] rounded py-1">
                                Gỡ/Xóa
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
