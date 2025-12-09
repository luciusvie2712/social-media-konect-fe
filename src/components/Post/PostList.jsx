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
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-14 h-14 border-[3px] border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Đang tải bài viết...</p>
        <p className="text-gray-400 text-sm mt-2">Vui lòng chờ trong giây lát</p>
      </div>
    );

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {posts?.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <PostCard 
              post={post} 
              key={post._id || index}
              index={index}
              onUpdatePost={handlePostUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-12 select-none">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mb-4 animate-pulse">
              <i className="fa-regular fa-newspaper text-4xl text-blue-400"></i>
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <i className="fa-solid fa-search text-yellow-600 text-sm"></i>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Chưa có bài viết nào
          </h2>
          
          <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
            Hiện chưa có bài viết nào để hiển thị. Hãy kết nối với bạn bè 
            hoặc tạo bài viết đầu tiên để chia sẻ khoảnh khắc của bạn!
          </p>
          
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>
          
          <div className="bg-blue-50 rounded-xl p-5 max-w-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb"></i>
              Mẹo nhanh
            </h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-start gap-2 text-blue-700">
                <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                <span>Kết bạn với nhiều người hơn để xem bài viết đa dạng</span>
              </li>
              <li className="flex items-start gap-2 text-blue-700">
                <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                <span>Tương tác với bài viết sẽ giúp bạn thấy nhiều nội dung hơn</span>
              </li>
              <li className="flex items-start gap-2 text-blue-700">
                <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                <span>Chia sẻ bài viết đầu tiên để bắt đầu cuộc trò chuyện</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;