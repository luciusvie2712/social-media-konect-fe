import PostList from "../../components/Post/PostList";
import LeftSidebar from "../../components/layout/LeftSideBar";
import RightSideBar from "../../components/layout/RightSideBar";
import { useEffect, useRef } from "react";

const HomePage = () => {


  return (
    <div className="w-full flex items-center gap-3">
      <div className="w-[25%] sticky top-14 h-[calc(100vh-56px)]">
          <LeftSidebar />
        </div>
        <div className="flex-1 w-[50%] mx-auto max-h-[calc(100vh-56px)] overflow-y-auto !pt-6">
          <PostList />
        </div>
        <div className="w-[25%] sticky top-14 h-[calc(100vh-56px)]">
          <RightSideBar />
        </div>
    </div>
  );
};


export default HomePage;