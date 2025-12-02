import { useSelector } from "react-redux";
import { useFriendRequest } from "../../hook/useFriendRequest";
import { toast } from "react-toastify";

const SuggestionCard = ({ index, item }) => {
  console.log(item);
  const user = useSelector((state) => state.user.account);
  const { status, handleSendFriendRequest } = useFriendRequest();
  const requesterId = user?.id;

  const onSendRequest = async () => {
    try {
      const res = await handleSendFriendRequest(requesterId, item._id);
      if (res?.Ec !== 0) {
        toast.error(res.Mes);
      }
    } catch (error) {
      console.log(">>>>> Gui loi moi that bai: ", error);
    }
  };

  return (
    <div
      key={index}
      className="w-[180px] border-1 border-[#cdcdcd] rounded flex flex-col items-center cursor-pointer bg-[#eeeeee]"
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
            onClick={onSendRequest}
            className="font-semibold py-1 rounded w-full hover:bg-blue-400 bg-blue-300 text-black"
          >
            Thêm bạn bè
          </button>
        ) : (
          <button
            onClick={onSendRequest}
            className="font-semibold py-1 rounded w-full hover:bg-gray-400 bg-gray-300 text-black"
          >
            Hủy lời mời
          </button>
        )}
        <button className="font-semibold py-1 rounded w-full hover:bg-gray-400 bg-gray-300 text-black">
          Gỡ/Xóa
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
