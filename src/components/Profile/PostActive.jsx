import PostList from "../Post/PostList"
const PostActive = () => {
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
                <div className="bg-white border-[#cdcdcd] border-1 flex flex-col px-4 py-3 rounded">
                    <div className="w-full flex flex-col gap-2">
                        <span>Bạn bè</span>
                    </div>
                </div>
            </div>
            <div className="flex w-[70%] overflow-y-auto">
                <PostList />
            </div>
            
        </div>
    )
}

export default PostActive