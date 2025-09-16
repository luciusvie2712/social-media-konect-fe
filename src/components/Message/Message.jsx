import "../../styles/Message.scss";
import avatar from "../../assets/download.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getConversation, getListUserChatted } from "../../utils/api.customize";
import { assign } from "lodash";
import { toast } from "react-toastify";
import { createSocket } from "../../socket/socket";

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
  useEffect(() => {
    if (!userId) return;
    const socket = createSocket(userId);
    socket.on("receive_message", (data) => {
      const message = data.newMess;
      const isCurrent =
        message.senderId === currentReceiverId ||
        message.receiverId === currentReceiverId;
      if (isCurrent) {
        setMessageSegment((prev) => [...prev, message]);
      }
      updateChatRealTime(message);
    });
  }, [userId, currentReceiverId]);

  const updateChatRealTime = (message) => {
    const chatPartnerId =
      message.senderId === userId ? message.receiverId : message.senderId;
    setListUserChat((prev = []) => {
      const existing = prev.find((item) => item.userId === chatPartnerId);
      const others = prev.filter((item) => item.userId !== chatPartnerId);
      const update = {
        userId: chatPartnerId,
        name: existing?.name,
        avatar: existing?.avatar || sample,
        lastMessage: message.message,
        time: new Date().toISOString(),
      };
      return [update, ...others];
    });
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
  console.log("hahaha", messageSegment);
  return (
    <div className="message-container">
      <div className="message-content">
        <div className="message-content__left">
          <div className="left__header">
            <div className="header__user-name">{user?.name}</div>
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
            {messageSegment && messageSegment.length > 0 && (
              <>
                <div className="header__info">
                  <div className="avatar-user">
                    <img
                      src={messageSegment[0]?.receiverId?.avatar || avatar}
                      alt=""
                    />
                  </div>
                  <div className="name">
                    {messageSegment[0]?.receiverId?.name}
                  </div>
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
              </>
            )}
          </div>
          {messageSegment && messageSegment.length > 0 ? (
            <>
              <div className="center__frame-chat">
                {messageSegment.slice().map((msg, index) => (
                  <div
                    key={msg._id}
                    className={`message-row ${
                      msg.senderId !== userId ? "left" : "right"
                    }`}
                  >
                    {msg.senderId !== userId && (
                      <div className="img-receiver">
                        <img src={msg.receiverId.avatar || avatar} />
                      </div>
                    )}
                    <div className="bubble">
                      {msg.message && msg.message}

                      {msg.media && msg.media.length > 0 && (
                        <>
                          <div className="media-list">
                            {msg.media.map((file, index) => {
                              return file.type === "image" ? (
                                <img
                                  src={file.url}
                                  key={file._id}
                                  className="chat-media"
                                />
                              ) : file.type === "video" ? (
                                <video
                                  key={file._id}
                                  controls
                                  className="chat-media"
                                >
                                  <source src={file.url} type="video" />
                                </video>
                              ) : null;
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
            </>
          ) : (
            <span>deo co cac gi</span>
          )}
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
