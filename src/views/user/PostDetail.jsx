import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { getPostById, LikePost, deletePost, handleReportPost, authorDeletePost } from "../../utils/api.customize"
import { useComment } from "../../hook/useComment"
import { timeAgo } from "../../utils/timeAgo"
import avatar from "../../assets/download.png"
import CommentItem from "../../components/Post/CommentItem"

const PostDetail = () => {
    const { postId } = useParams()
    const navigate = useNavigate()
    const commentInputRef = useRef(null)
    const menuRef = useRef(null)
    const sliderRef = useRef(null)
    
    const [postData, setPostData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState("")
    const [statusLike, setStatusLike] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [reportReason, setReportReason] = useState("")
    const [openMenu, setOpenMenu] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    
    const user = useSelector((state) => state.user.account)
    const userId = user?.id
    
    const {
        comments,
        loading: commentsLoading,
        fetchComments,
        handleCreateComment,
        handleDeleteComment,
    } = useComment()

    useEffect(() => {
        const fetchPostById = async () => {
            setLoading(true)
            try {
                const res = await getPostById(postId)
                if (res?.Ec === 0 && res?.Data) {
                    setPostData(res.Data)
                    setLikesCount(res.Data.likes?.length || 0)
                    
                    // Check if user liked the post
                    const isLiked = res.Data.likes?.some(like => {
                        if (typeof like === "string") return like === userId
                        if (typeof like === "object" && like._id) return like._id === userId
                        return false
                    })
                    setStatusLike(isLiked)
                    
                    // Fetch comments
                    await fetchComments(res.Data._id)
                } else {
                    toast.error("Bài viết không tồn tại")
                    navigate("/")
                }
            } catch (error) {
                console.error("Fetching post by ID error: ", error)
                toast.error("Đã xảy ra lỗi khi tải bài viết")
            } finally {
                setLoading(false)
            }
        }

        fetchPostById()
    }, [postId])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLikePost = async () => {
        if (!userId) {
            toast.warning("Vui lòng đăng nhập để thích bài viết")
            return
        }

        try {
            const response = await LikePost(userId, postData._id)
            if (response?.Ec === 0) {
                setStatusLike(!statusLike)
                setLikesCount(prev => statusLike ? prev - 1 : prev + 1)
                
                // Update post data
                setPostData(prev => ({
                    ...prev,
                    likes: statusLike 
                        ? prev.likes.filter(like => {
                            if (typeof like === "string") return like !== userId
                            if (typeof like === "object" && like._id) return like._id !== userId
                            return true
                        })
                        : [...prev.likes, userId]
                }))
            }
        } catch (error) {
            console.error("Error liking post:", error)
        }
    }

    const handleCreateNewComment = async () => {
        if (!newComment.trim()) return
        if (!userId) {
            toast.warning("Vui lòng đăng nhập để bình luận")
            return
        }

        try {
            const success = await handleCreateComment({
                post: postData._id,
                author: userId,
                content: newComment,
            })

            if (success) {
                setNewComment("")
                await fetchComments(postData._id)
                // Focus lại input
                if (commentInputRef.current) {
                    commentInputRef.current.focus()
                }
            }
        } catch (error) {
            console.error("Error creating comment:", error)
        }
    }

    const onCreate = async (content, parentComment = null) => {
        const success = await handleCreateComment({
        post: postId,
        author: userId,
        content,
        parentComment,
        });
        if (success) {
        await fetchComments(postId);
        setNewComment("");
        }
    };

    const handleDeletePost = async () => {
        try {
            const res = await authorDeletePost(postData._id)
            if (res?.Ec === 0) {
                toast.success("Đã xóa bài viết")
                navigate(-1)
            } else {
                toast.warning(res?.Mes)
            }
        } catch (error) {
            console.error("Error deleting post:", error)
            toast.error("Đã xảy ra lỗi khi xóa bài viết")
        } finally {
            setShowDeleteModal(false)
        }
    }

    const handleReportPost = async () => {
        if (!reportReason.trim()) {
            toast.warning("Vui lòng chọn lý do báo cáo")
            return
        }

        try {
            const response = await handleReportPost(postData._id, userId, reportReason)
            if (response?.Ec === 0) {
                toast.success("Đã báo cáo bài viết thành công")
                setShowReportModal(false)
                setReportReason("")
            } else {
                toast.warning(response?.Mes)
            }
        } catch (error) {
            console.error("Error reporting post:", error)
            toast.error("Đã xảy ra lỗi khi báo cáo")
        }
    }

    const handleSharePost = () => {
        const postUrl = `${window.location.origin}/post/${postId}`
        navigator.clipboard.writeText(postUrl)
            .then(() => toast.success("Đã sao chép link bài viết"))
            .catch(() => toast.error("Không thể sao chép link"))
    }

    const onDelete = async (commentId) => {
        const success = await handleDeleteComment(commentId, userId);
        if (success) await fetchComments(postId);
    };

    const nextSlide = () => {
        const mediaList = getMediaList()
        setCurrentSlide((prev) => (prev + 1) % mediaList.length)
    }

    const prevSlide = () => {
        const mediaList = getMediaList()
        setCurrentSlide((prev) => (prev - 1 + mediaList.length) % mediaList.length)
    }

    const getMediaList = () => {
        if (!postData?.media) return []
        return Array.isArray(postData.media)
            ? postData.media.filter((m) => m?.url)
            : postData.media?.url
            ? [postData.media]
            : []
    }

    const renderMedia = () => {
        const mediaList = getMediaList()
        
        if (mediaList.length === 0) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                        <div className="text-6xl mb-4 opacity-30">📷</div>
                        <p className="text-gray-500">Không có hình ảnh</p>
                    </div>
                </div>
            )
        }

        if (mediaList[0]?.type === "video") {
            return (
                <div className="w-full h-full flex items-center justify-center bg-black">
                    <video 
                        src={mediaList[0].url} 
                        controls 
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )
        }

        if (mediaList.length === 1) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-black">
                    <img 
                        src={mediaList[0].url} 
                        alt="Post media" 
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )
        }

        // Multiple images - Slider
        return (
            <div className="relative w-full h-full bg-black overflow-hidden">
                {/* Slider Container */}
                <div 
                    ref={sliderRef}
                    className="flex transition-transform duration-300 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {mediaList.map((media, index) => (
                        <div 
                            key={index} 
                            className="w-full h-full flex-shrink-0 flex items-center justify-center"
                        >
                            <img 
                                src={media.url} 
                                alt={`Slide ${index + 1}`}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                {mediaList.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {mediaList.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        index === currentSlide 
                                            ? 'bg-white w-4' 
                                            : 'bg-white/50 hover:bg-white/70'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Slide Counter */}
                        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentSlide + 1} / {mediaList.length}
                        </div>
                    </>
                )}
            </div>
        )
    }

    const REPORT_REASONS = [
        "Nội dung phản cảm hoặc không phù hợp",
        "Spam, quảng cáo hoặc lừa đảo",
        "Ngôn từ kích động thù hận",
        "Thông tin sai sự thật",
        "Bạo lực, đe dọa hoặc làm hại người khác",
        "Quấy rối hoặc bắt nạt",
        "Chia sẻ thông tin cá nhân không cho phép",
        "Nội dung nhạy cảm (18+)",
        "Vi phạm bản quyền",
    ]

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải bài viết...</p>
                </div>
            </div>
        )
    }

    if (!postData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle text-6xl text-gray-400 mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Bài viết không tồn tại</h3>
                    <button 
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={() => navigate("/")}
                    >
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-gray-50 flex items-center justify-center w-full">
                <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg flex flex-col md:flex-row h-[90vh]">
                    {/* Media Container - Left Side */}
                    <div className="md:w-3/5 h-full bg-black flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full">
                            {renderMedia()}
                        </div>
                    </div>

                    {/* Detail Container - Right Side */}
                    <div className="md:w-2/5 h-full flex flex-col border-l border-gray-200">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3 gap-2">
                                <img
                                    src={postData.author?.avatar || avatar}
                                    alt={postData.author?.name}
                                    className="w-12 h-12 rounded-full border-2 border-blue-400 cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => navigate(`/profile/${postData.author?._id}`)}
                                />
                                <div className="flex flex-col gap-1">
                                    <span 
                                        className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors text-[18px]"
                                        onClick={() => navigate(`/profile/${postData.author?._id}`)}
                                    >
                                        {postData.author?.name}
                                    </span>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span>{timeAgo(postData.createdAt)}</span>
                                        {postData.visibility === "public" && (
                                            <i className="fas fa-globe-americas text-xs"></i>
                                        )}
                                        {postData.visibility === "friends" && (
                                            <i className="fas fa-user-friends text-xs"></i>
                                        )}
                                        {postData.visibility === "private" && (
                                            <i className="fas fa-lock text-xs"></i>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Menu */}
                            <div className="relative" ref={menuRef}>
                                <button 
                                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                    onClick={() => setOpenMenu(!openMenu)}
                                >
                                    <i className="fas fa-ellipsis-h text-gray-600"></i>
                                </button>
                                
                                {openMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                        {postData.author?._id === userId ? (
                                            <button 
                                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                                onClick={() => setShowDeleteModal(true)}
                                            >
                                                <i className="fas fa-trash w-4"></i>
                                                <span>Xóa bài viết</span>
                                            </button>
                                        ) : (
                                            <button 
                                                className="w-full px-4 py-2 text-left text-amber-600 hover:bg-amber-50 flex items-center space-x-2"
                                                onClick={() => setShowReportModal(true)}
                                            >
                                                <i className="fas fa-flag w-4"></i>
                                                <span>Báo cáo bài viết</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Caption */}
                        {postData.caption && (
                            <div className="p-4 border-b border-gray-200">
                                <p className="text-gray-800 whitespace-pre-wrap break-words">
                                    {postData.caption}
                                </p>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-4 gap-2">
                                <div className="flex items-center space-x-1 gap-1">
                                    <i className="fas fa-thumbs-up text-gray-400"></i>
                                    <span>{likesCount} lượt thích</span>
                                </div>
                                <div className="flex items-center space-x-1 gap-1">
                                    <i className="fas fa-comment text-gray-400"></i>
                                    <span>{comments.length} bình luận</span>
                                </div>
                            </div>
                        </div>

                        {/* Interaction Buttons */}
                        <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-around">
                            <button 
                                className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors gap-2 ${
                                    statusLike ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                                }`}
                                onClick={handleLikePost}
                            >
                                <i className={`fas fa-heart ${statusLike ? 'text-blue-600' : ''}`}></i>
                                <span className="font-medium">Thích</span>
                            </button>
                            <button 
                                className="flex-1 py-2 rounded-lg text-gray-600 hover:text-blue-600 flex items-center justify-center space-x-2 transition-colors gap-2"
                                onClick={() => commentInputRef.current?.focus()}
                            >
                                <i className="fas fa-comment"></i>
                                <span className="font-medium">Bình luận</span>
                            </button>
                            <button 
                                className="flex-1 py-2 rounded-lg text-gray-600 hover:text-blue-600 flex items-center justify-center space-x-2 transition-colors gap-2"
                                onClick={handleSharePost}
                            >
                                <i className="fas fa-link"></i>
                                <span className="font-medium">Sao chép liên kết</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <span className="font-semibold text-gray-900 mb-4">
                                Bình luận ({comments.length})
                            </span>
                            
                            {commentsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <i className="fas fa-spinner fa-spin text-gray-400 mr-2"></i>
                                    <span className="text-gray-500">Đang tải bình luận...</span>
                                </div>
                            ) : comments.length > 0 ? (
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <CommentItem
                                            key={comment._id}
                                            comment={comment}
                                            userId={userId}
                                            onReply={onCreate}
                                            onDelete={onDelete}
                                            level={0}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <i className="far fa-comment text-4xl text-gray-300 mb-2"></i>
                                    <p className="text-gray-500">Hãy là người đầu tiên bình luận</p>
                                </div>
                            )}
                        </div>

                        {/* Comment Input */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <img
                                    src={user?.avatar || avatar}
                                    alt="Your avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1 relative">
                                    <input
                                        ref={commentInputRef}
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Viết bình luận..."
                                        className="w-full px-4 py-2 pr-20 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault()
                                                handleCreateNewComment()
                                            }
                                        }}
                                    />
                                </div>
                                {newComment.trim() && (
                                    <button 
                                        className="w-11 h-11 rounded-full! bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                                        onClick={handleCreateNewComment}
                                    >
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Xóa bài viết</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex space-x-3">
                            <button 
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                onClick={handleDeletePost}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Báo cáo bài viết</h3>
                            <p className="text-gray-600 mt-1">Chọn lý do báo cáo:</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-2">
                                {REPORT_REASONS.map((reason, index) => (
                                    <label 
                                        key={index}
                                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="reportReason"
                                            value={reason}
                                            checked={reportReason === reason}
                                            onChange={(e) => setReportReason(e.target.value)}
                                            className="w-4 h-4 text-blue-500"
                                        />
                                        <span className="flex-1 text-gray-700">{reason}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex space-x-3">
                            <button 
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowReportModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="flex-1 py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleReportPost}
                                disabled={!reportReason}
                            >
                                Báo cáo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PostDetail