import { useSelector } from "react-redux";
import { useAcceptRequest } from "../../hook/useAcceptRequest";
import avatar from "../../assets/download.png";

const RequestCard = ({ index, item }) => {
  const user = useSelector((state) => state.user.account);
  const { status, handleAcceptFriendRequest } = useAcceptRequest();

  const onAcceptRequest = async () => {
    try {
      await handleAcceptFriendRequest(item.requester._id, user.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[180px] border-1 border-[#cdcdcd] rounded flex flex-col items-center cursor-pointer bg-[#eeeeee]">
      <img
        src={item?.requester?.avatar || avatar}
        className="rounded-t-[4px]"
      />
      <div className="w-full flex flex-col item-center pt-2">
        <span className="text-[15px] font-semibold px-2">
          {item?.requester?.name}
        </span>
        <span className="text-[13px] px-2 opacity-50">
          {item.mutualFriends} bạn chung
        </span>
      </div>
      <div className="flex flex-col w-full items-center gap-2 text-[15px] mt-2 mb-2 px-2">
        {status === "idle" ? (
          <>
            <button
              onClick={onAcceptRequest}
              className="font-semibold py-1 rounded w-full hover:bg-blue-400 bg-blue-300 text-black"
            >
              Xác nhận
            </button>
            <button className="font-semibold py-1 rounded w-full hover:bg-gray-400 bg-gray-300 text-black]">
              Từ chối
            </button>
          </>
        ) : (
          <span>Đã là bạn bè</span>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
