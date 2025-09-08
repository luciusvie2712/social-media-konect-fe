

const createPost = ({ isOpen, setIsOpen, account }) => {
    if (!isOpen) return null

    return (
        <div className="w-screen h-screen flex justify-center items-center z-10 bg-[rgba(0,0,0,0.5)] fixed top-0 left-0">
            <div className="absolute right-2 top-2 border-1 px-3 py-2 rounded-full cursor-pointer" onClick={() => setIsOpen(false)}>V</div>
            <form action="" className="bg-white text-black">
                <div className="">
                    <h3>Tạo bài viết</h3>
                </div>
                <div className="">
                    <div className="">
                        <div>
                            <img src="" alt="" />
                        </div>
                        <div className="">
                            <div className="">{account.name}</div>
                            <div className="">
                                <select>
                                    <option value="public">Công khai</option>
                                    <option value="friends">Bạn bè</option>
                                    <option value="private">Chỉ mình tôi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <input type="text" placeholder="Hôm nay bạn thấy thế nào ....."/>
                    </div>
                    <div>
                        <input type="file" name="media" id="media" />
                    </div>
                </div>
                <div className="">
                    <button className="">Đăng bài viết</button>
                </div>
            </form>
        </div>
    )
}

export default createPost