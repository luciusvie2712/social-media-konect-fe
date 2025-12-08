// PostList.js
import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { useGetPost } from "../../hook/useGetPost";

const PostList = () => {
  const { posts: initialPosts, loading } = useGetPost();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts);
    }
  }, [initialPosts]);

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? { ...post, ...updatedPost } : post
    ));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="w-[100%] flex flex-col items-center justify-start gap-6 px-4">
      {posts?.length > 0 ? (
        posts.map((post, index) => (
          <PostCard 
            post={post} 
            key={post._id || index}
            index={index}
            onUpdatePost={handlePostUpdate}
          />
        ))
      ) : (
        <p>Không có bài viết nào</p>
      )}
    </div>
  );
};

export default PostList;