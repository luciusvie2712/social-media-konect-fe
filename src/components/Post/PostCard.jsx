import { useState } from "react"
import { motion, AnimatePresence, inView } from "framer-motion";


const PostCard = ({ post, index }) => {
    const [ currentIndex, setCurrentIndex ] = useState(0)
    console.log(post)
    const mediaList = Array.isArray(post?.media) ? post.media.filter((m) => m?.url) : post?.media?.url ? [post.media] : []

    const renderMedia = () => {
        if (mediaList[0]?.type === "video") {
            const video = mediaList[0]
            return (
                <div className="relative w-full rounded overflow-hidden bg-black aspect-video">
                    <video src={video.url} className="w-full h-full object-cover" controls />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full">
                            <i className="fa-solid fa-play text-white text-xl hover:text-orange-300"></i>
                        </div>
                    </div>
                </div>
                
            )
        }

        if (mediaList.lenght === 1) {
            return (
                <div className="w-full rounded-xl overflow-hidden aspect-[3/4]">
                    <img src={mediaList[0].url} className="w-full h-full object-cover" />
                </div>
            )
        }   
        const displayImageList = mediaList.slice(0, 9)
        const hiddenCount = mediaList.length - 9
        return (
            <div
                className={`grid ${
                    displayImageList.length === 2 
                    ? "grid-cols-2"
                    : displayImageList.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-3"
                } gap-1 overflow-hidden`}
            >
                {displayImageList.map((media, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden">
                        <img
                            src={media.url}
                            alt=""
                            className="w-full h-full rounded object-cover"
                        />
                        {index === 8 && hiddenCount > 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
                                +{hiddenCount}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div key={index} className="w-[max(35vw,400px)] rounded bg-[#3131319e] px-3 py-2 shadow-[#4f4f4f] hover:shadow-lg transition-all duration-300">
            <div className="w-full flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center">
                        <img src={post?.author?.avatar} className="rounded-full w-8" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="font-semibold text-white">
                            <div>{post?.author?.name}</div>
                            <div className="flex items-center gap-2">
                                <span className="opacity-80">2 giờ</span>
                                <i className="fa-solid fa-earth-americas"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cursor-pointer">
                    <i className="fa-solid fa-ellipsis w-[24px] text-[20px]"></i>
                </div>
            </div>
            <div className="w-full flex flex-col gap-2 mt-2">
                {post.caption && 
                    <div className="text-[14px]">
                        {post.caption}
                    </div>
                }
                {mediaList?.length === 0 || <div className="mt-3">
                    {renderMedia()}
                </div>}
                
            </div>
            <hr />
            <div className="w-full flex items-center mb-1 justify-around text-[15px]">
                <div className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#5d5d5d7c] py-1 gap-2 rounded">
                    <i className="fa-regular fa-heart w-4"></i>
                    <span>Like</span>
                </div>
                <div className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#5d5d5d7c] py-1 gap-2 rounded">
                    <i className="fa-regular fa-comment w-4"></i>
                    <span>Bình luận</span>
                </div>
                <div className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#5d5d5d7c] py-1 gap-2 rounded">
                    <i className="fa-solid fa-share w-4"></i>
                    <span>Chia sẻ</span>
                </div>
            </div>
        </div>
    )
}

export default PostCard