import RequestCard from "./RequestCard";
import SuggestionCard from "./SuggestionCard";

const ShowGridFriend = ({ data, type }) => {
    return (
        <div className="grid grid-cols-5 gap-3 overflow-x-auto">
            {type === "request"
                ? data.map((item, index) => (
                    <RequestCard key={index} item={item} />
                  ))
                : data.map((item, index) => (
                    <SuggestionCard key={index} item={item} />
                  ))
            }
        </div>
    );
};

export default ShowGridFriend;
