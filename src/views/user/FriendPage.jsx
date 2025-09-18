import NavBar from '../../components/Friends/NavBar'
import ShowGridFriend from '../../components/Friends/ShowGridFriend'
import '../../styles/FriendPage.scss'
import { friendRequest } from '../../assets/fake.data'

const FriendPage = () => {

    return (
        <div className="container">
            <div className="navbar-left">
                <NavBar />
            </div>
            <div className="display-content">
                <div className="title">
                    <p>Lời mời kết bạn</p>
                </div>
                <ShowGridFriend data={friendRequest} type="request" />
                <hr />
                <div className="title">
                    <p>Gợi ý kết bạn</p>
                </div>
                <ShowGridFriend data={friendRequest} type="suggestion" />
            </div>
        </div>
    )
}

export default FriendPage