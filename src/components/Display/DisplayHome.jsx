import StoryList from "./StoryList"

const DisplayHome = () => {
    return (
        <div className="w-[100%] h-screen overflow-auto flex flex-col items-center">
            Home Page
            <StoryList />
        </div>
    )
}

export default DisplayHome