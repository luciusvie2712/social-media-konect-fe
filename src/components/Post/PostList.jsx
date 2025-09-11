import PostCard from "./PostCard"
import { postList } from "../../assets/fake.data"

const PostList = () => {
    console.log(postList)
    return (
        <div className="w-[100%] flex flex-col items-center justify-center gap-3">
            {postList.map((post, index) => (
                <PostCard post={post} key={index} />
            ))}
        </div>
    )
}

export default PostList