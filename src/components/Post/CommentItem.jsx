import { useState } from "react"
import avatar from "../../assets/download.png";

const CommentItem = ({ comment, userId, onReply, onDelete, level = 0 }) => {
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [showChildren, setShowChildren] = useState(false)

    const handleReply = async () => {
        if (!replyText.trim()) return
        await onReply(replyText, comment._id)
        setReplyText("")
        setShowReplyBox(false)
    }
    const handleToggleChildren = () => {
        setShowChildren(prev => !prev)
    }
    return (
        <div
            className="w-full flex flex-col mt-2"
            style={{ paddingLeft: `${level * 20}px` }}
        >
            <div className="flex w-full justify-between items-start">
                <div className="flex gap-2 w-full">
                    <img
                        src={comment.author?.avatar || avatar}
                        alt=""
                        className="w-9 h-9 rounded-full"
                    />
                    <div className="w-full">
                        <div className="text-[#b15426] font-medium">
                            {comment.author?.name || "Ẩn danh"}
                        </div>
                        <div className="text-white text-sm">{comment.content}</div>
                        <div className="flex gap-3 text-xs opacity-70 mt-1">
                            <button
                                onClick={() => {
                                    setShowReplyBox((prev) => !prev)
                                    if (!showReplyBox) {
                                        setReplyText(`@${comment?.author?.name || "Ẩn danh"} `)
                                    }
                                }}
                                className="hover:underline"
                            >
                                Trả lời
                            </button>
                            {comment.author?._id === userId && (
                                <button
                                onClick={() => onDelete(comment._id)}
                                className="hover:underline text-red-400"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                        {comment?.children?.length > 0 && (
                            <button
                                onClick={handleToggleChildren}
                                className="w-full flex items-center gap-2 text-[12px] opacity-55 mt-1 hover:opacity-80 transition"
                            >
                                <span className="bg-[#ccc] h-[1px] w-[5%]"></span>
                                <span>
                                    {showChildren
                                        ? "Ẩn phản hồi"
                                        : `Xem ${comment?.children.length} phản hồi`}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {showChildren && comment.children?.length > 0 && (
                <div className="mt-2">
                    {comment.children.map((child) => (
                        <CommentItem
                            key={child._id}
                            comment={child}
                            userId={userId}
                            onReply={onReply}
                            onDelete={onDelete}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
            {showReplyBox && (
                <div className="w-full flex gap-2 items-center mt-2 ml-10">
                    <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Phản hồi bình luận..."
                        className="bg-[#494949] text-white p-2 rounded flex-1"
                    />
                <button
                    onClick={handleReply}
                    className="bg-[#b15426] px-3 py-1 rounded text-white hover:bg-[#8e3e1d]"
                >
                    Gửi
                </button>
                </div>
            )}
        </div>
        
    )
}

export default CommentItem