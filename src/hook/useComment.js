import { useCallback, useState } from "react"
import { createComment, deleteComment, getComment } from "../utils/api.customize"
import { toast } from "react-toastify"

export const useComment = () => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchComments = useCallback(async (postId) => {
        if (!postId) return
        setLoading(true)
        try {
            const res = await getComment(postId)
            if (res?.Ec === 0) {
                setComments(res?.data)
            } else {
                console.warn(">> Load comment error: ", res?.Mes)
            }
        } catch (error) {
            console.error(">> Fetch comment error: ", error)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreateComment = useCallback(async (dataComment) => {
        try {
            console.log(dataComment)
            const res = await createComment(dataComment)
            if (res?.Ec === 0) {
                toast.success("Đã đăng bình luận!")
                return true
            } else {
                toast.warning("Không thể đăng bình luận" || res?.Mes)
            }
        } catch (error) {
            console.error("Create comment error: ", error)
        }
    }, [])

    const handleDeleteComment = useCallback(async (commentId,) => {
        try {
            const res = await deleteComment(commentId,)
            if (res?.Ec === 0) {
                toast.success("Đã xóa bình luận!")
                return true
            } else {
                toast.warn("Không thể xóa bình luận")
                console.warn(">> Delete comment error: ", res?.Mes)
                return false
            }
        } catch (error) {
            console.error(">>> Delete comment error: ", error)
            return false

        }
    })


    return { comments, loading, fetchComments, handleCreateComment, handleDeleteComment }
}