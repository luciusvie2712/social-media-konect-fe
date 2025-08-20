import "./App.css";
import Display from "./components/Display/Display";
import SideBar from "./components/SideBar"

function App() {
  return (
    <div className="gap-5 max-w-[100vw] h-screen flex bg-[#000000]">
      <SideBar />
      <Display />
    </div>
  )
}

export default App;
