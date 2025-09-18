
const NavBar = () => {
    return (
        <div className="w-[100%] h-full flex flex-col items-center">
            <div className="w-full text-[20px] font-medium">
                <p>Bạn bè</p>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
                <div className="w-full flex items-center gap-3 py-2 hover:bg-[#5b5b5b] cursor-pointer rounded px-2">
                    <i className="fa-solid fa-user-group w-4"></i>
                    <span>Lời mời kết bạn</span>
                </div>
                <div className="w-full flex items-center gap-3 py-2 hover:bg-[#5b5b5b] cursor-pointer rounded px-2">
                    <i className="fa-solid fa-user-plus w-4"></i>
                    <span>Gợi ý kết bạn</span>
                </div>
                <div className="w-full flex items-center gap-3 py-2 hover:bg-[#5b5b5b] cursor-pointer rounded px-2">
                    <i className="fa-solid fa-address-book w-4"></i>
                    <span>Tất cả bạn bè</span>
                </div>
            </div>
        </div>
    )
}

export default NavBar