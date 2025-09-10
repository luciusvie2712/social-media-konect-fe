import avatar from "../../assets/download.png"
import imagePost from "../../assets/image/image_post.jpg"

const PostCard = () => {
    return (
        <div className="w-[max(35vw,400px)] rounded bg-[#3131319e] px-3 py-2">
            <div className="w-full flex items-center gap-3">
                <div className="flex justify-center items-center">
                    <img src={avatar} className="rounded-full w-8" />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-semibold text-white">
                        <div className="">Theanh88</div>
                        <div className="flex items-center gap-2">
                            <span>2 giờ</span>
                            <i className="fa-solid fa-earth-americas"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col gap-2 mt-2">
                <div className="text-[14px]">
                    Con Thiên An chó 
                </div>
                <div className="">
                    <img src={imagePost} className=""/>
                </div>
            </div>
            <hr />
            <div className="w-full flex items-center mb-1 justify-around text-[15px]">
                <div className="w-[calc(100%/3)] flex items-center justify-center curor-pointer hover:bg-[#5d5d5d7c] py-1 gap-2 rounded">
                    <i className="fa-regular fa-heart w-4"></i>  <span>Like</span>
                </div>
                <div className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#5d5d5d7c] py-1 gap-2 rounded">
                    <i className="fa-regular fa-comment w-4"></i>  <span>Bình luận</span>
                </div>
                <div className="w-[calc(100%/3)] flex items-center justify-center cursor-pointer hover:bg-[#5d5d5d7c] py-1 gap-2 rounded">
                    <i className="fa-solid fa-share w-4"></i>  <span>Chia sỏe</span>
                </div>
            </div>
        </div>
    )
}

export default PostCard