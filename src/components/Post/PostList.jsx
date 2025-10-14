import PostCard from "./PostCard";
import { useSelector } from "react-redux";
import { useGetPost } from "../../hook/useGetPost";

const PostList = () => {
  const user = useSelector((state) => state.user.account);
  console.log(user.id);

  const { posts, loading } = useGetPost(user.id);

  if (loading) return <p>Loading ...</p>;
  return (
    <div className="w-[100%] flex flex-col items-center justify-center gap-6 px-4">
      {posts?.length > 0 ? (
        posts.map((post, index) => <PostCard post={post} key={index} />)
      ) : (
        <p>Không có bài viết nào</p>
      )}
    </div>
  );
};

export default PostList;
