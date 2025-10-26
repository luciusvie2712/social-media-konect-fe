import { useState } from "react"
import avatar from "../../assets/download.png";

const CommentItem = ({ comment, userId, onReply, onDelete, level = 0 }) => {
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyText, setReplyText] = useState("")

    const handleReply = async () => {
        if (!replyText.trim()) return
        await onReply(replyText, comment._id)
        setReplyText("")
        setShowReplyBox(false)
    }
    console.log(">>>> Comment data: ", comment)
    return (
        <div
            className="w-full flex flex-col mt-2"
            style={{ marginLeft: `${level * 20}px` }}
        >
            <div className="flex justify-between items-start">
                <div className="flex gap-2">
                    <img
                        src={comment.author?.avatar || avatar}
                        alt=""
                        className="w-9 h-9 rounded-full"
                    />
                <div>
                    <div className="text-[#b15426] font-medium">
                        {comment.author?.name || "Ẩn danh"}
                    </div>
                    <div className="text-white text-sm">{comment.content}</div>
                    <div className="flex gap-3 text-xs opacity-70 mt-1">
                        <button
                            onClick={() => setShowReplyBox((prev) => !prev)}
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
                </div>
                </div>
            </div>

            {showReplyBox && (
                <div className="flex gap-2 items-center mt-2 ml-10">
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

            {comment.children?.length > 0 &&
                comment.children.map((child) => (
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
    )
}

export default CommentItem