import PostCard from "./PostCard"

const PostList = () => {
    return (
        <div className="w-[100%] flex flex-col items-center justify-center gap-3">
            <PostCard />
            <PostCard />
        </div>
    )
}

export default PostList