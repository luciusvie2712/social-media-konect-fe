import { useEffect, useState } from "react"
import { getPostAUser } from "../../utils/api.customize"
import PostCard from "../Post/PostCard"

const PostActive = ({ userId, friends }) => {
    const [loading, setLoading] = useState(false)
    const [userPost, setUserPost] = useState([])

    useEffect(() => {
        const fetchUserPost = async () => {
            try {
                setLoading(true)
                const res = await getPostAUser(userId)
                if (res.Ec === 0) {
                    setUserPost(res.Data)
                } else {
                    setUserPost([])
                }
            } catch (error) {
                console.error("Error fetch user Posts: ", error)
            } finally {
                setLoading(false)
            }
        }

        if (userId) {
            fetchUserPost();
        }
    }, [userId])

    return (
        <div className="w-full flex items-start gap-3 justify-center">
            <div className="flex flex-col gap-3 w-[30%]">
                <div className="bg-white border-[#cdcdcd] border-1 flex flex-col px-4 py-3 rounded">
                    <div className="w-full flex flex-col gap-2">
                        <span className="font-bold text-[17px]">Giới thiệu</span>
                        <span>Làm việc tại <b>2ChanBank</b></span>
                        <span>Học tập <b>Đại học Công nghiệp TP.Hồ Chí Minh</b></span>
                        <span>Sống tại <b>Băng Clock, Châu Phi</b></span>
                    </div>
                </div>
                <div className="w-full bg-white border-[#cdcdcd] border-1 flex flex-col px-4 py-3 rounded">
                    <div className="w-full flex flex-col gap-2">
                        <span>Bạn bè</span>
                        {friends.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                                {friends.map((f) => (
                                    <div className="w-full flex flex-col justify-start gap-2">
                                        <img src={f.avatar} alt="" className="w-full rounded"/>
                                        <div className="w-full flex items-center px-1">
                                            <span className="font-medium">{f.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span>Chưa có bạn bè</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex w-[70%] overflow-y-auto">
                <div className="w-full flex flex-col items-center gap-3">
                    {loading ? (
                        <div className="flex justify-center items-center h-screen">
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : userPost.map((p, i) => (
                        <PostCard post={p} index={i} />
                    ))}

                </div>
            </div>
            
        </div>
    )
}

export default PostActive