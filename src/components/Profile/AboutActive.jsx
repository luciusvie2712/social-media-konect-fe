
const AboutActive = () => {
    return (
        <div className="w-full grid grid-cols-2 grid-rows-2 gap-4">
            <div className="flex flex-col gap-2 bg-white border border-[#cdcdcd] px-4 py-2 rounded">
                <span className="font-bold text-[18px]">Việc làm</span>
                <span>Đang làm việc tại <b>2ChanBank</b></span>
                <span>Đã làm việc tại <b>3ChanBank</b></span>
            </div>
            <div className="flex flex-col gap-2 bg-white border border-[#cdcdcd] px-4 py-2 rounded">
                <span className="font-bold text-[18px]">Học vấn</span>
                <span>Từng học tại <b>Trường THPT Ca Văn Thỉnh</b></span>
                <span>Đang học tại <b>Đại học Công nghiệp TP.Hồ Chí Minh</b></span>
            </div>
            <div className="col-span-2 row-start-2 flex flex-col gap-2 bg-white border border-[#cdcdcd] px-4 py-2 rounded">
                <span className="font-bold text-[18px]">Thông tin liên hệ</span>
                <span>Email: <b>vinh15062005@gmail.com</b></span>
                <span>Điện thoại: <b>0382694132</b></span>
            </div>
        </div>
    )
}

export default AboutActive