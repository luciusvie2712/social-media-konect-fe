import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFriendActions } from "../../hook/useFriendActions";
import avatar from "../../assets/download.png";
import { useNavigate } from "react-router-dom";

const SuggestionCard = ({ index, item   }) => {
  const user = useSelector((state) => state.user.account);
  const requesterId = user?.id;
  const navigate = useNavigate()

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
      console.error(err);
    }
  };

  const onCancel = async () => {
    try {
      const res = await handleRejectFriendRequest(requesterId, item._id);
      if (res.Ec !== 0) toast.error(res.Mes);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div
      key={index}
      className="w-[180px] border border-[#cdcdcd] rounded flex flex-col items-center cursor-pointer bg-[#eeeeee]"
    >
      <img src={item.avatar || avatar} className="rounded-t-[4px]" />

      <div onClick={() => navigate(`/friends/suggestion/${item?.id || item?._id}`)} className="w-full flex flex-col item-center pt-2">
        <span className="text-[15px] font-semibold px-2 truncate">{item.name}</span>
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
