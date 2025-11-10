import videoBanner from '../../assets/video/video_banner.mp4'

const Banner = () => {
    return (
        <div className="relative w-full h-[300px] overflow-hidden shadow-md">
            <video autoPlay muted loop className="w-full h-full object-cover">
                <source src={videoBanner} type='video/mp4' />
            </video>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[45px]'>
                <span>Konect</span>
            </div>
        </div>
    )
}

export default Banner