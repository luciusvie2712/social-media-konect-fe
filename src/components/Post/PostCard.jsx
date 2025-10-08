import { useState } from "react"


const PostCard = ({ post, index }) => {
    const [ currentIndex, setCurrentIndex ] = useState(0)
    const mediaList = Array.isArray(post?.media) ? post.media.filter((m) => m?.url) : post?.media?.url ? [post.media] : []

    const handlePrev = () => {
        setCurrentIndex((prev) => 
            prev === 0 ? mediaList.length - 1 : prev - 1
        )
    }
    const handleNext = () => {
        setCurrentIndex((prev) => 
            prev === mediaList.length - 1 ? 0 : prev + 1
        )
    }

    return (
        <div key={index} className="w-[max(35vw,400px)] rounded bg-[#3131319e] px-3 py-2">
            <div className="w-full flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center">
                        <img src={post.avatar} className="rounded-full w-8" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="font-semibold text-white">
                            <div>{post.name}</div>
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
                {mediaList?.length > 0 && (
                    <div className="relative w-full flex justify-center items-center mt-2">
                        {mediaList[currentIndex].type === "video" ? (
                            <video
                                src={mediaList[currentIndex].url}
                                controls
                                className="max-h-[500px] w-full rounded-lg object-contain"
                            />
                            ) : (
                            <img
                                src={mediaList[currentIndex].url}
                                className="max-h-[500px] w-full rounded-lg object-contain"
                            />
                        )}

                        {mediaList?.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#00000088] p-2 rounded-full hover:bg-[#000000cc]"
                                >
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00000088] p-2 rounded-full hover:bg-[#000000cc]"
                                >
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </>
                        )}
                    </div>
                )}
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