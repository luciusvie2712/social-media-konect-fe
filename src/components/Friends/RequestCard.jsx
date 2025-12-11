import { useSelector } from "react-redux";
import { useFriendActions } from "../../hook/useFriendActions";
import avatar from "../../assets/download.png";

const RequestCard = ({ index, item }) => {
  const user = useSelector((state) => state.user.account);
  const { status, handleAcceptFriendRequest, handleRejectFriendRequest } =
    useFriendActions();

  const onAcceptRequest = async () => {
    try {
      await handleAcceptFriendRequest(item._id, user.id);
    } catch (error) {
      console.error(error);
    }
  };

  const onRejectRequest = async () => {
    try {
      await handleRejectFriendRequest(item._id, user.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[180px] border border-[#cdcdcd] rounded flex flex-col items-center cursor-pointer bg-[#eeeeee]">
      <img src={item?.avatar || avatar} className="rounded-t-[4px]" />

      <div className="w-full flex flex-col item-center pt-2">
        <span className="text-[15px] font-semibold px-2">{item?.name}</span>
      </div>

      <div className="flex flex-col w-full items-center gap-2 text-[15px] mt-2 mb-2 px-2">

        {status === "idle" && (
          <>
            <button
              onClick={onAcceptRequest}
              className="font-semibold py-1 rounded w-full bg-blue-300 hover:bg-blue-400 transition"
            >
              Xác nhận
            </button>

            <button
              onClick={onRejectRequest}
              className="font-semibold py-1 rounded w-full bg-gray-300 hover:bg-gray-400 transition"
            >
              Từ chối
            </button>
          </>
        )}

        {status === "accepted" && (
          <span className="text-green-600 font-semibold">Đã là bạn bè</span>
        )}

        {status === "rejected" && (
          <span className="text-red-600 font-semibold">Đã từ chối</span>
        )}

        {status === "loading" && (
          <span className="opacity-60 italic">Đang xử lý...</span>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
