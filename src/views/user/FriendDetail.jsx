import { useNavigate, useParams } from "react-router-dom"
import ShowListFriends from "../../components/Friends/ShowListFriends"
import '../../styles/FriendDetail.scss'
import { friendRequest } from "../../assets/fake.data"

const FriendDetail = () => {
    const { type } = useParams() 
    console.log(">>> ", type)
    const navigate = useNavigate()
    const dataFriends = friendRequest
    return (
        <div className="container">
            <div className="nav-left">
                <div className="header-nav">
                    <div onClick={() => navigate(-1)} className="btn-back">
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                    {type === "request" ? <span>Lời mời kết bạn</span> : <span>Gợi ý kết bạn</span>}
                </div>
                <div className="show-list">
                    {type === "request" ? dataFriends.map((item, index) => (
                        <ShowListFriends typeList={type} key={index} item={item}/>
                    )) : dataFriends.map((item, index) => (
                        <ShowListFriends typeList={type} key={index} item={item}/>
                    ))}
                </div>
            </div>
            <div className="display">
                Profile
            </div>

        </div>
    )
}

export default FriendDetail