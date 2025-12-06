import "../../styles/Message.scss";
import avatar from "../../assets/download.png";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getConversation,
  getListUserChatted,
  sendMessage,
} from "../../utils/api.customize";
import _, { assign } from "lodash";
import { toast } from "react-toastify";
import { createSocket } from "../../socket/socket";
import { useFriendList } from "../../hook/useFriendList";

const Message = () => {
  const user = useSelector((state) => state.user.account);
  const userId = user?.id;
  const [showDetail, setShowDetail] = useState(false);
  const [listUserChat, setListUserChat] = useState();
  const [messageSegment, setMessageSegment] = useState([]);
  const [currentReceiverId, setCurrentReceiverId] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formSendMess, setFormSendMess] = useState({
    message: "",
    media: [],
    senderId: "",
    receiverId: "",
  });
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      requestAnimationFrame(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      });
    }
  }, [messageSegment]);

  useEffect(() => {
    if (userId && currentReceiverId) {
      setFormSendMess((prev) => ({
        ...prev,
        senderId: userId,
        receiverId: currentReceiverId,
      }));
    }
  }, [userId, currentReceiverId]);

  const formData = new FormData();
  formData.append("senderId", formSendMess.senderId);
  formData.append("message", formSendMess.message);
  formData.append("receiverId", formSendMess.receiverId);
  selectedFiles.forEach(fileItem => {
    formData.append("media", fileItem.file);
  });

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
        avatar: existing?.avatar || avatar,
        lastMessage: message.message || "Đã gửi một ảnh",
        time: new Date().toISOString(),
      };
      return [update, ...others];
    });
  };
  
  const clickViewMessageSegment = async (receiverId) => {
    setCurrentReceiverId(receiverId);
    setSelectedFiles([]); // Reset selected files khi chuyển người chat
    
    const res = await getConversation(userId, receiverId);
    if (res?.Ec === 0) {
      setMessageSegment(res.dataMes);
    } else {
      toast.error(res?.Mes);
    }
  };
  
  const handleSendMessage = async () => {
    if ((!_.isEmpty(formSendMess.message) && selectedFiles.length === 0) && 
        (!_.isEmpty(formSendMess.message) || selectedFiles.length === 0)) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      let res = await sendMessage(formData);
      if (res?.Ec === 0) {
        setFormSendMess((prev) => ({
          ...prev,
          message: "",
          media: [],
        }));
        setSelectedFiles([]);
        
        // Update last message in list
        updateChatAfterSending();
      } else {
        toast.error(res?.Mes);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Gửi tin nhắn thất bại");
    } finally {
      setIsUploading(false);
    }
  };
  
  const updateChatAfterSending = () => {
    if (!currentReceiverId) return;
    
    const lastMessage = selectedFiles.length > 0 
      ? `Đã gửi ${selectedFiles.length} ảnh${formSendMess.message ? ' và tin nhắn' : ''}`
      : formSendMess.message;
    
    setListUserChat((prev = []) => {
      const existing = prev.find((item) => item.userId === currentReceiverId);
      const others = prev.filter((item) => item.userId !== currentReceiverId);
      const update = {
        userId: currentReceiverId,
        name: existing?.name,
        avatar: existing?.avatar || avatar,
        lastMessage,
        time: new Date().toISOString(),
      };
      return [update, ...others];
    });
  };

  // Chọn file ảnh
  const chooseFileSendMess = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Kiểm tra số lượng file
      const maxFiles = 10;
      if (files.length > maxFiles) {
        toast.error(`Chỉ có thể chọn tối đa ${maxFiles} ảnh`);
        return;
      }
      
      // Kiểm tra định dạng file
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        toast.error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      // Tạo preview cho từng file
      const filesWithPreview = files.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }));
      
      setSelectedFiles(prev => [...prev, ...filesWithPreview]);
      
      // Reset input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Xóa ảnh đã chọn
  const removeSelectedFile = (id) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // Tìm kiếm + mở đoạn chat mới
  const [friendSearchText, setFriendSearchText] = useState("")
  const [friendSearchResult, setfriendSearchResult] = useState([])
  const { friends } = useFriendList("all", userId)

  useEffect(() => {
    if (!friendSearchText.trim()) {
      setfriendSearchResult([]) 
      return
    }

    const result = friends.filter(f => 
      f.name.toLowerCase().includes(friendSearchText.toLowerCase())
    )

    setfriendSearchResult(result)
    console.log(friendSearchResult)
  }, [friendSearchText, friends])

  // Tạo đoạn chat mới
  const handleCreateNewChat = async (friendId) => {
    try {
      const res = await getConversation(userId, friendId)
      // Trường hợp đã có đoạn chat
      if (res?.Ec === 0) {
        setCurrentReceiverId(friendId)
        setMessageSegment(res.dataMes)
        setSelectedFiles([])
      } 
      // Trường hợp CHƯA có đoạn chat
      else if (res?.Ec === -2 || res?.Mes === "Not found") {
        setCurrentReceiverId(friendId)
        setMessageSegment([]) // mở UI chat rỗng
        setSelectedFiles([])
      } else {
        toast.error(res?.Mes)
        return
      }

      // Update danh sách chat
      setListUserChat((prev = []) => {
        const exist = prev.find((i) => i.userId === friendId)
        if (exist) return prev

        const friend = friends.find((f) => f._id === friendId)

        const newChat = {
          userId: friend._id,
          name: friend.name,
          avatar: friend.avatar,
          lastMessage: "",
          time: new Date().toISOString(),
        };

        return [newChat, ...prev]
      });

      setFriendSearchText("")
      setfriendSearchResult([])
    } catch (err) {
      console.error(err)
    }
  };

  // Render preview ảnh đã chọn
  const renderSelectedFilesPreview = () => {
    if (selectedFiles.length === 0) return null;
    
    return (
      <div className="selected-files-preview">
        <div className="preview-header">
          <span className="preview-title">
            Đã chọn {selectedFiles.length} ảnh
          </span>
          <button
            onClick={() => setSelectedFiles([])}
            className="remove-all-btn"
          >
            Xóa tất cả
          </button>
        </div>
        <div className="files-grid">
          {selectedFiles.map(fileItem => (
            <div key={fileItem.id} className="file-preview">
              <img
                src={fileItem.preview}
                alt={fileItem.name}
                className="preview-image"
              />
              <button
                onClick={() => removeSelectedFile(fileItem.id)}
                className="remove-file-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

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

          {/* Ô tìm kiếm và tạo đoạn chat mới */}
          <div className="left__search-chat relative">
            <label htmlFor="">
              <div>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <input 
                type="search" 
                name="search" 
                placeholder="Tìm kiếm" 
                value={friendSearchText}
                onChange={(e) => setFriendSearchText(e.target.value)}
              />
            </label>
            {/* Hiển thị kết quả tìm kiếm */}
            {friendSearchResult.length > 0 && (
            <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 shadow-md max-h-60 overflow-y-auto"> 
              {friendSearchResult.map((fr) => (
                <div
                  key={fr?.userId}         
                  onClick={() => handleCreateNewChat(fr._id)}   
                  className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 cursor-pointer"    
                >
                  <img src={fr.avatar || avatar} className="w-10 h-10 rounded-full" />
                  <span className="text-base">{fr.name}</span>
                </div>
              ))}
            </div>
          )}
          </div>

          <div className="left__subtitle">Tin nhắn</div>
          <div className="left__list-chatted">
            {listUserChat &&
              listUserChat.length > 0 &&
              listUserChat.map((item) => {
                return (
                  <div
                    key={item._id}
                    className={`chatted-card ${
                      currentReceiverId === item.userId ? "active" : ""
                    }`}
                    onClick={() => clickViewMessageSegment(item.userId)}
                  >
                    <div className="avatar-user">
                      <img src={item.avatar || avatar} alt="" />
                    </div>
                    <div className="detail-chat">
                      <div className="name">{item.name}</div>
                      <div className="last-chat">
                        <div className="chat">{item.lastMessage}</div>
                        <div className="time-ago">
                          {item.time.split("T")[1].slice(0, 5)}
                        </div>
                      </div>
                    </div>
                  </div>
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
          {currentReceiverId ? (
            <>
              <div className="center__frame-chat" ref={chatBodyRef}>
                {messageSegment.map((msg, index) => (
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
                    <span
                      className="options"
                      onClick={() => setShowOptions(!showOptions)}
                    >
                      <i className="fa-solid fa-ellipsis w-3"></i>
                    </span>

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
              
              {/* Preview ảnh đã chọn */}
              {renderSelectedFilesPreview()}
              
              <div
                className="center__send"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              >
                <div className="input-frame">
                  <div className="icon-message">
                    <i className="fa-solid fa-envelope text-blue-500 text-xl"></i>
                  </div>
                  <input
                    type="text"
                    placeholder={selectedFiles.length > 0 ? "Nhập tin nhắn (tùy chọn)..." : "Tin nhắn ...."}
                    value={formSendMess["message"]}
                    onChange={(e) =>
                      setFormSendMess((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    disabled={isUploading}
                  />

                  <div className="button-add-img">
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      id="file-mess"
                      multiple
                      accept="image/*"
                      onChange={chooseFileSendMess}
                      disabled={isUploading}
                    />
                    <label
                      className="fa-solid fa-image"
                      htmlFor="file-mess"
                    ></label>
                  </div>
                  <div className="button-send">
                    {isUploading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i
                        className="fa-solid fa-paper-plane"
                        onClick={handleSendMessage}
                      ></i>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-40 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">TIN NHẮN</span>
              <i className="fa-regular fa-message text-5xl mt-2"></i>
            </div>
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