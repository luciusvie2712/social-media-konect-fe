import PostList from "../../components/Post/PostList";
import LeftSidebar from "../../components/layout/LeftSideBar";
import RightSideBar from "../../components/layout/RightSideBar";
import Banner from '../../components/Banner/Banner'
import { useEffect, useRef } from "react";

const HomePage = () => {
  const postListRef = useRef(null);

  useEffect(() => {
    const list = postListRef.current;
    if (!list) return;

    const isPageAtBottom = () =>
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight - 1;

    const isPageAtTop = () => window.scrollY <= 0;
    const handleWheel = (e) => {
      const dy = e.deltaY;

      const canPostScrollDown = list.scrollTop + list.clientHeight < list.scrollHeight;
      const canPostScrollUp = list.scrollTop > 0;

      if (dy < 0 && canPostScrollUp) {
        e.preventDefault();
        list.scrollTop += dy;
        return;
      }
      if (dy > 0) {
        if (isPageAtBottom() && canPostScrollDown) {
          e.preventDefault();
          list.scrollTop += dy;
          return;
        }
        return;
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel, { passive: false });
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex justify-center items-center w-full">
        <Banner />
      </div>

      <div className="flex w-full justify-center items-center">
        <div className="w-[25%] sticky top-14 h-[calc(100vh-56px)]">
          <LeftSidebar />
        </div>
        <div ref={postListRef} className="flex-1 w-[50%] mx-auto max-h-[calc(100vh-56px)] overflow-y-auto">
          <PostList />
        </div>
        <div className="w-[25%] sticky top-14 h-[calc(100vh-56px)]">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};


export default HomePage;