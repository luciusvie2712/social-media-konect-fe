import { useState } from "react";

const Caption = ({ caption }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = caption?.length > 120;

    const formatCaption = (text) => {
        const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
        return parts.map((part, index) => {
            if (part.startsWith('#')) {
            return (
                <span
                key={index}
                className="text-blue-500 cursor-pointer"
                onClick={() => console.log("Click hashtag:", part)}
                >
                {part}
                </span>
            );
            }
            return part;
        });
    }
    return (
        <div className="text-[15px] whitespace-pre-wrap relative">
            <div
                className={
                    expanded
                    ? ""
                    : "line-clamp-2 overflow-hidden"
                }
            >
                {formatCaption(caption)}
            </div>

            {!expanded && isLong && (
                <span
                    className="text-blue-500 cursor-pointer ml-1"
                    onClick={() => setExpanded(true)}
                >
                    Xem thêm
                </span>
            )}

            {expanded && isLong && (
                <span
                    className="text-blue-500 cursor-pointer ml-1"
                    onClick={() => setExpanded(false)}
                >
                    Thu gọn
                </span>
            )}
        </div>
    );
}

export default Caption
