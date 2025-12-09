import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFriendActions } from "../../hook/useFriendActions";
import avatar from "../../assets/download.png";

const SuggestionCard = ({ index, item   }) => {
  const user = useSelector((state) => state.user.account);
  const requesterId = user?.id;

  const {
    status,
    handleSendFriendRequest,
    handleRejectFriendRequest,
  } = useFriendActions();

  const onSend = async () => {
    try {
      const res = await handleSendFriendRequest(requesterId, item._id);
      if (res.Ec !== 0) toast.error(res.Mes);
    } catch (err) {
      console.log(">>> Lỗi gửi lời mời:", err);
    }
  };

  const onCancel = async () => {
    try {
      const res = await handleRejectFriendRequest(requesterId, item._id);
      if (res.Ec !== 0) toast.error(res.Mes);
    } catch (err) {
      console.log(">>> Lỗi hủy lời mời:", err);
    }
  };


  return (
    <div
      key={index}
      className="w-[180px] border border-[#cdcdcd] rounded flex flex-col items-center cursor-pointer bg-[#eeeeee]"
    >
      <img src={item.avatar || avatar} className="rounded-t-[4px]" />

      <div className="w-full flex flex-col item-center pt-2">
        <span className="text-[15px] font-semibold px-2">{item.name}</span>
        <span className="text-[13px] px-2 opacity-50">
          {item.mutualFriends} bạn chung
        </span>
      </div>

      <div className="flex flex-col w-full items-center gap-2 text-[15px] mt-2 mb-2 px-2">
        {status === "idle" ? (
          <button
            onClick={onSend}
            className="font-semibold py-1 rounded w-full hover:bg-blue-600 bg-blue-700 text-white"
          >
            Thêm bạn bè
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="font-semibold py-1 rounded w-full hover:bg-gray-400 bg-gray-300 text-black"
          >
            Hủy lời mời
          </button>
        )}

        <button
          className="font-semibold py-1 rounded w-full hover:bg-gray-400 bg-gray-300 text-black cursor-not-allowed!"
        >
          Gỡ/Xóa
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
