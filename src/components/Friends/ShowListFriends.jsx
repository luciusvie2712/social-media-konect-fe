import { useSelector } from "react-redux";
import avatar from "../../assets/download.png";

const ShowListFriends = ({ item, typeList, index, onSelect }) => {
  const user = useSelector((state) => state.user.account);

  return (
    <div
      key={index}
      onClick={onSelect}
      className="w-full flex items-center gap-3 hover:bg-gray-200 cursor-pointer px-3 py-2 rounded transition-colors"
    >
      <div className="flex-shrink-0">
        <img 
          src={item.avatar || avatar} 
          className="w-12 h-12 rounded-full object-cover"
          alt={item.name}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">
          {item.name}
        </div>
      </div>
    </div>
  );
};

export default ShowListFriends;