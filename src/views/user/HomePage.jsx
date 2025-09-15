import PostList from "../../components/Post/PostList"


const HomePage = () => {
    return (
        <div className="w-[100%] h-screen overflow-auto flex flex-col items-center pt-3">
            <PostList />
        </div>
    )
}

export default HomePage
