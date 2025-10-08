import { useEffect, useState } from "react"
import { getPost } from "../utils/api.customize"

export const useGetPost = (id) => {
    const [ posts, setPosts ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        if (!id) return

        const fetchPost = async () => {
            try {
                setLoading(true)
                const resData = await getPost(id)
                if (resData.Ec === 0) {
                    setPosts(Array.isArray(resData.Data) ? resData.Data : [resData.Data])
                } else {
                    console.warn("Error get post: ", resData.Mes)
                    setPosts(null)
                }
            } catch (error) {
                console.error("Error fetching post: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [id])

    return { posts, loading }
}