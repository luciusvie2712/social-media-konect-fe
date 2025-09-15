import "../../styles/Message.scss";
import avatar from "../../assets/download.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getConversation, getListUserChatted } from "../../utils/api.customize";
import { assign } from "lodash";
import { toast } from "react-toastify";

const Message = () => {
  const user = useSelector((state) => state.user.account);
  const userId = user?.id;
  const [showDetail, setShowDetail] = useState(false);
  const [listUserChat, setListUserChat] = useState();
  const [messageSegment, setMessageSegment] = useState([]);
  const [currentReceiverId, setCurrentReceiverId] = useState("");
  useEffect(() => {
    if (userId) {
      getListUser();
    }
  }, [user]);
  const getListUser = async () => {
    let res = await getListUserChatted(userId);
    if (res?.Ec === 0) {
      setListUserChat(res.users);
    } else {
      toast.error(res?.Mes);
    }
  };

  const clickViewMessageSegment = async (receiverId) => {
    setCurrentReceiverId(receiverId);
    const res = await getConversation(userId, receiverId);
    if (res?.Ec === 0) {
      setMessageSegment(res.dataMes);
    } else {
      toast.error(res?.Mes);
    }
  };
  return (
    <div className="message-container">
      <div className="message-content">
        <div className="message-content__left">
          <div className="left__header">
            <div className="header__user-name">Nguyen Van Tu Vinh</div>
            <div className="header__new-chat">
              <i className="fa-solid fa-circle-plus"></i>
            </div>
          </div>
          <div className="left__search-chat">
            <label htmlFor="">
              <div>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <input type="search" name="search" placeholder="Tìm kiếm" />
            </label>
          </div>
          <div className="left__subtitle">Tin nhắn</div>
          <div className="left__list-chatted">
            {listUserChat &&
              listUserChat.length > 0 &&
              listUserChat.map((item) => {
                return (
                  <>
                    <div
                      className="chatted-card"
                      onClick={() => clickViewMessageSegment(item.userId)}
                    >
                      <div className="avatar-user">
                        <img src={item.avatar || avatar} alt="" />
                      </div>
                      <div className="detail-chat">
                        <div className="name">{item.nameUser}</div>
                        <div className="last-chat">
                          <div className="chat">{item.lastMessage}</div>
                          <div className="time-ago">
                            {item.time.split("T")[1].slice(0, 5)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>

        <div
          className={`message-content__center ${
            showDetail ? "half" : "seventyfive"
          }`}
        >
          <div className="center__header">
            <div className="header__info">
              <div className="avatar-user">
                <img src={avatar} alt="" />
              </div>
              <div className="name">Antony Nguyen</div>
            </div>
            <div className="header__action">
              <div className="call-icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="video-call-icon">
                <i className="fa-solid fa-video"></i>
              </div>
              <div
                className="detail-icon"
                onClick={() => setShowDetail(!showDetail)}
              >
                <i className="fa-solid fa-circle-info"></i>
              </div>
            </div>
          </div>
          <div className="center__frame-chat"></div>
          <div className="center__send">
            <div className="input-frame">
              <div className="icon-message">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <input type="text" placeholder="Tin nhắn ...." />
              <div className="button-add-img">
                <i className="fa-solid fa-image"></i>
              </div>
              <div className="button-send">
                <i className="fa-solid fa-paper-plane"></i>
              </div>
            </div>
          </div>
        </div>

        {showDetail && (
          <div className="message-content__right">
            <div className="right__header"></div>
            <div className="right__notification"></div>
            <div className="right__action"></div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Message;
