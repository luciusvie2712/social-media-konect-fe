import '../../styles/Message.scss'
import avatar from '../../assets/download.png'
import { useState } from 'react';

const Message = () => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div className="message-container">
      <div className="message-content">
        <div className="message-content__left">
          <div className="left__header">
            <div className="header__user-name">
              Nguyen Van Tu Vinh
            </div>
            <div className="header__new-chat">
              <i className="fa-solid fa-circle-plus"></i>
            </div>
          </div>
          <div className="left__search-chat">
            <label htmlFor="">
              <div>
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <input type="search" name="search" placeholder='Tìm kiếm'/>
            </label>
          </div>
          <div className="left__subtitle">
            Tin nhắn
          </div>
          <div className="left__list-chatted">
              <div className="chatted-card">
                <div className="avatar-user">
                  <img src={avatar} alt="" />
                </div>
                <div className="detail-chat">
                  <div className="name">
                    Antony Nguyen
                  </div>
                  <div className="last-chat">
                    <div className="chat">Mấy cái thằng đàn ông lên mạ....</div>
                    <div className="time-ago"> - 2 giờ</div>
                  </div>
                </div>
              </div>
              <div className="chatted-card">
                <div className="avatar-user">
                  <img src={avatar} alt="" />
                </div>
                <div className="detail-chat">
                  <div className="name">
                    Antony Nguyen
                  </div>
                  <div className="last-chat">
                    <div className="chat">Mấy cái thằng đàn ông lên mạ....</div>
                    <div className="time-ago"> - 2 giờ</div>
                  </div>
                </div>
              </div>
              <div className="chatted-card">
                <div className="avatar-user">
                  <img src={avatar} alt="" />
                </div>
                <div className="detail-chat">
                  <div className="name">
                    Antony Nguyen
                  </div>
                  <div className="last-chat">
                    <div className="chat">Mấy cái thằng đàn ông lên mạ....</div>
                    <div className="time-ago"> - 2 giờ</div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        <div className={`message-content__center ${showDetail ? "half" : "seventyfive"}`}>
          <div className="center__header">
            <div className="header__info">
              <div className="avatar-user">
                <img src={avatar} alt="" />
              </div>
              <div className="name">
                Antony Nguyen
              </div>
            </div>
            <div className="header__action">
              <div className="call-icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="video-call-icon">
                <i className="fa-solid fa-video"></i>
              </div>
              <div className="detail-icon" onClick={() => setShowDetail(!showDetail)}>
                <i className="fa-solid fa-circle-info"></i>
              </div>
            </div>
          </div>
          <div className="center__frame-chat">

          </div>
          <div className="center__send">
            <div className="input-frame">
              <div className="icon-message">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <input type="text" placeholder='Tin nhắn ....'/>
              <div className="button-add-img">
                <i class="fa-solid fa-image"></i>
              </div>
              <div className="button-send">
                <i class="fa-solid fa-paper-plane"></i>
              </div>
            </div>
          </div>
        </div>

        {showDetail && (
          <div className="message-content__right">
            <div className="right__header">

            </div>
            <div className="right__notification">

            </div>
            <div className="right__action">

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Message;
