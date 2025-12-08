import { useState } from "react"
import avatar from "../../assets/download.png"

const CommentItem = ({ comment, userId, onReply, onDelete, level = 0 }) => {
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [showChildren, setShowChildren] = useState(false)
    console.log(comment)
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
            className={`w-full flex flex-col ${level === 0 ? 'py-1 border-b border-gray-100' : 'py-1'}`}
            style={{ marginLeft: `${level * 24}px` }}
        >
            <div className="flex w-full items-start gap-3">
                <img
                    src={comment.author?.avatar || avatar}
                    alt={comment.author?.name || "User"}
                    className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-blue-100"
                />
                
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                            {comment.author?.name || "Ẩn danh"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    
                    <p className="text-gray-800 text-sm mb-2 whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setShowReplyBox((prev) => !prev)
                                if (!showReplyBox) {
                                    setReplyText(`@${comment?.author?.name || "Ẩn danh"} `)
                                }
                            }}
                            className="text-[14px]! font-medium text-gray-500 hover:underline transition-colors"
                        >
                            Phản hồi
                        </button>
                        
                        {comment.author?._id === userId && (
                            <button
                                onClick={() => onDelete(comment._id)}
                                className="text-[14px]! font-medium text-gray-500 hover:underline transition-colors"
                            >
                                Xóa
                            </button>
                        )}
                    </div>

                    {/* Show replies toggle */}
                    {comment?.children?.length > 0 && (
                        <button
                            onClick={handleToggleChildren}
                            className="mt-1 flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors group"
                        >
                            <div className="w-6 h-px bg-gray-300 group-hover:bg-gray-400"></div>
                            <span>
                                <i className={`fas fa-chevron-${showChildren ? 'up' : 'down'} text-xs pr-1!`}></i>
                                {showChildren ? "Ẩn phản hồi" : `Xem ${comment.children.length} phản hồi`}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Reply input box */}
            {showReplyBox && (
                <div className="ml-12 mt-3 flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Viết phản hồi..."
                            className="w-full px-4 py-2 pr-24 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleReply()
                                }
                            }}
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                            <button 
                                onClick={() => setShowReplyBox(false)}
                                className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReply}
                                disabled={!replyText.trim()}
                                className="px-4 py-1 bg-blue-500 text-white rounded-full! text-xs font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Child comments */}
            {showChildren && comment.children?.length > 0 && (
                <div className="pt-2 border-gray-200 pl-4 ml-6!">
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
        </div>
    )
}

export default CommentItem