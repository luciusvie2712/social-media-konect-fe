import PostList from "../../components/Post/PostList";
import LeftSidebar from "../../components/layout/LeftSideBar";
import RightSideBar from "../../components/layout/RightSideBar";
import { useState } from "react";
import CreatePostsModal from "../../components/Modal/createPost.modal";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const user = useSelector((state) => state.user.account);

  return (
    <div className="w-full h-full flex items-center gap-3">
      <div className="w-[30%] xl:w-[25%] sticky top-14 h-[calc(100vh-56px)]">
        <LeftSidebar setIsCreateOpen={setIsCreateOpen} />
      </div>
      <div className="flex w-[70%] xl:w-[50%] h-full overflow-y-auto items-start!">
        <PostList />
      </div>
      <div className="hidden  xl:w-[25%] xl:sticky top-14 h-[calc(100vh-56px)]">
        <RightSideBar />
      </div>
      <CreatePostsModal
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        account={user}
      />
    </div>
  );
};

export default HomePage;
