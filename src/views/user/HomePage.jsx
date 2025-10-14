import PostList from "../../components/Post/PostList"


const HomePage = () => {
    return (
        <div className="w-[100%] h-[100vh] overflow-auto flex items-center pt-3">
            <div className="w-[70%] h-full overflow-auto flex flex-col items-center gap-6 px-4">
                <PostList />
            </div>
            <div className="w-[30%] h-full flex flex-col items-center gap-6">
                <div className="w-full h-[100px] flex justify-center items-center bg-[#222] border-[1px] border-[#494949] rounded">
                    FORM SEARCH
                </div>
                <div className="w-full h-[400px] flex flex-col items-center bg-[#222] border-[1px] border-[#494949] overflow-auto rounded">
                    ACTIVE FRIENDS
                </div>
                <div className="w-full flex flex-col items-center opacity-50">
                    USER SUPPORT CONTACT INFORMATION
                </div>
            </div>
        </div>
    )
}

export default HomePage
