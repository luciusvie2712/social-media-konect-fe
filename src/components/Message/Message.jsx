import "../../styles/Message.scss";
import avatar from "../../assets/download.png";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  deleteMessage,
  getConversation,
  getListUserChatted,
  sendMessage,
} from "../../utils/api.customize";
import _, { debounce } from "lodash";
import { toast } from "react-toastify";
import { createSocket } from "../../socket/socket";
import { useFriendList } from "../../hook/useFriendList";

const Message = () => {
  const user = useSelector((state) => state.user.account);
  const userId = user?.id;
  const [showDetail, setShowDetail] = useState(false);
  const [listUserChat, setListUserChat] = useState([]);
  const [messageSegment, setMessageSegment] = useState([]);
  const [currentReceiverId, setCurrentReceiverId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedIdDelete, setSelectedIdDelete] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  useEffect(() => {
    if (userId) {
      getListUser();
    }
  }, [user]);

  const getListUser = async () => {
    let res = await getListUserChatted(userId);
    if (res?.Ec === 0) {
      setListUserChat(res.users || []);
    } else {
      toast.error(res?.Mes);
    }
  };

  // Socket connection with cleanup
  useEffect(() => {
    if (!userId) return;

    const socket = createSocket(userId);
    let isMounted = true;

    const handleReceiveMessage = (data) => {
      if (!isMounted) return;

      const message = data.newMess;
      const normalizedCurrentReceiverId =
        typeof currentReceiverId === "object"
          ? currentReceiverId._id
          : currentReceiverId;
      const normalizedMessageReceiverId =
        typeof message.receiverId === "object"
          ? message.receiverId._id
          : message.receiverId;
      const normalizedMessageSenderId =
        typeof message.senderId === "object"
          ? message.senderId._id
          : message.senderId;

      const isCurrent =
        normalizedMessageSenderId === normalizedCurrentReceiverId ||
        normalizedMessageReceiverId === normalizedCurrentReceiverId;

      if (isCurrent) {
        setMessageSegment((prev) => {
          // Check for duplicates
          const exists = prev.find((msg) => {
            const normalizedMsgId =
              typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId;
            return (
              normalizedMsgId === normalizedMessageSenderId &&
              msg.message === message.message &&
              Math.abs(
                new Date(msg.createdAt).getTime() -
                  new Date(message.createdAt).getTime()
              ) < 1000
            );
          });

          if (exists) return prev;
          return [...prev, message];
        });
      }
      updateChatRealTime(message);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      isMounted = false;
      socket.off("receive_message", handleReceiveMessage);
      socket.disconnect();
    };
  }, [userId, currentReceiverId]);

  const updateChatRealTime = useCallback(
    (message) => {
      const normalizedUserId = userId.toString();
      const normalizedSenderId =
        typeof message.senderId === "object"
          ? message.senderId._id
          : message.senderId;

      const chatPartnerId =
        normalizedSenderId === normalizedUserId
          ? typeof message.receiverId === "object"
            ? message.receiverId._id
            : message.receiverId
          : normalizedSenderId;

      setListUserChat((prev = []) => {
        const existing = prev.find((item) => item.userId === chatPartnerId);

        // Prevent duplicate updates
        if (
          existing &&
          existing.lastMessage === (message.message || "Đã gửi một ảnh")
        ) {
          return prev;
        }

        const others = prev.filter((item) => item.userId !== chatPartnerId);
        const update = {
          userId: chatPartnerId,
          name:
            existing?.name ||
            (typeof message.senderId === "object"
              ? message.senderId.name
              : "Người dùng"),
          avatar:
            existing?.avatar ||
            (typeof message.senderId === "object"
              ? message.senderId.avatar
              : avatar) ||
            avatar,
          lastMessage: message.message || "Đã gửi một ảnh",
          time: new Date().toISOString(),
        };
        return [update, ...others];
      });
    },
    [userId]
  );

  const clickViewMessageSegment = async (receiverId) => {
    setCurrentReceiverId(receiverId);
    setSelectedFiles([]);
    setSelectedIdDelete("");

    const res = await getConversation(userId, receiverId);
    if (res?.Ec === 0) {
      setMessageSegment(res.dataMes || []);
    } else {
      toast.error(res?.Mes);
    }
  };

  const handleSendMessage = async () => {
    // Prevent multiple sends
    if (isUploading || isSending) {
      return;
    }

    if (_.isEmpty(formSendMess.message.trim()) && selectedFiles.length === 0) {
      toast.warning("Vui lòng nhập tin nhắn hoặc chọn ảnh");
      return;
    }

    setIsUploading(true);
    setIsSending(true);

    // Create new FormData for each send
    const newFormData = new FormData();
    newFormData.append("senderId", formSendMess.senderId);
    newFormData.append("message", formSendMess.message.trim());
    newFormData.append("receiverId", formSendMess.receiverId);
    selectedFiles.forEach((fileItem) => {
      newFormData.append("media", fileItem.file);
    });

    try {
      let res = await sendMessage(newFormData);
      if (res?.Ec === 0) {
        // Clear form
        setFormSendMess((prev) => ({
          ...prev,
          message: "",
          media: [],
        }));
        setSelectedFiles([]);

        // Update chat list
        updateChatAfterSending(
          formSendMess.message.trim(),
          selectedFiles.length
        );
      } else {
        toast.error(res?.Mes);
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Gửi tin nhắn thất bại");
    } finally {
      setIsUploading(false);
      // Reset sending state after delay
      setTimeout(() => setIsSending(false), 1000);
    }
  };

  const updateChatAfterSending = useCallback(
    (messageText, filesCount) => {
      if (!currentReceiverId) return;

      const lastMessage =
        filesCount > 0
          ? `Đã gửi ${filesCount} ảnh${messageText ? " và tin nhắn" : ""}`
          : messageText;

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
    },
    [currentReceiverId]
  );

  // Debounced send message
  const debouncedSendMessage = useCallback(
    debounce(handleSendMessage, 500, { leading: true, trailing: false }),
    [handleSendMessage]
  );

  const chooseFileSendMess = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      const maxFiles = 10;
      if (files.length > maxFiles) {
        toast.error(`Chỉ có thể chọn tối đa ${maxFiles} ảnh`);
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const invalidFiles = files.filter(
        (file) => !validTypes.includes(file.type)
      );

      if (invalidFiles.length > 0) {
        toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)");
        return;
      }

      const filesWithPreview = files.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));

      setSelectedFiles((prev) => [...prev, ...filesWithPreview]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeSelectedFile = (id) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const [friendSearchText, setFriendSearchText] = useState("");
  const [friendSearchResult, setfriendSearchResult] = useState([]);
  const { friends } = useFriendList("all", userId);

  useEffect(() => {
    if (!friendSearchText.trim()) {
      setfriendSearchResult([]);
      return;
    }

    const result = friends.filter(
      (f) =>
        f &&
        f.name &&
        f.name.toLowerCase().includes(friendSearchText.toLowerCase())
    );

    setfriendSearchResult(result);
  }, [friendSearchText, friends]);

  const handleCreateNewChat = async (friendId) => {
    try {
      const res = await getConversation(userId, friendId);
      if (res?.Ec === 0) {
        setCurrentReceiverId(friendId);
        setMessageSegment(res.dataMes || []);
        setSelectedFiles([]);
      } else if (res?.Ec === -2 || res?.Mes === "Not found") {
        setCurrentReceiverId(friendId);
        setMessageSegment([]);
        setSelectedFiles([]);
      } else {
        toast.error(res?.Mes);
        return;
      }

      setListUserChat((prev = []) => {
        const exist = prev.find((i) => i.userId === friendId);
        if (exist) return prev;

        const friend = friends.find((f) => f._id === friendId);
        if (!friend) return prev;

        const newChat = {
          userId: friend._id,
          name: friend.name,
          avatar: friend.avatar || avatar,
          lastMessage: "",
          time: new Date().toISOString(),
        };

        return [newChat, ...prev];
      });

      setFriendSearchText("");
      setfriendSearchResult([]);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tạo cuộc trò chuyện mới");
    }
  };

  const handleDeleteChat = (messId) => {
    if (selectedIdDelete === messId) {
      setSelectedIdDelete("");
    } else {
      setSelectedIdDelete(messId);
    }
  };

  const handleConfirmDelete = async (messId) => {
    if (!messId) return;

    const oldMessages = [...messageSegment];
    setMessageSegment((prev) => prev.filter((msg) => msg._id !== messId));
    setSelectedIdDelete("");

    try {
      const res = await deleteMessage(messId);
      if (res?.Ec === 0) {
        toast.success("Đã xoá tin nhắn");
      } else {
        setMessageSegment(oldMessages);
        toast.error("Xoá thất bại");
      }
    } catch (err) {
      console.log(err);
      setMessageSegment(oldMessages);
      toast.error("Xoá thất bại");
    }
  };

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
          {selectedFiles.map((fileItem) => (
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

  // Helper function to get normalized ID
  const getNormalizedId = (id) => {
    if (!id) return "";
    if (typeof id === "object" && id._id) return id._id.toString();
    return id.toString();
  };

  // Get current chat partner info
  const currentChatPartner = listUserChat?.find(
    (user) => user.userId === currentReceiverId
  );

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

          <div className="left__search-chat relative">
            <label>
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
            {friendSearchResult.length > 0 && (
              <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 shadow-md max-h-60 overflow-y-auto">
                {friendSearchResult.map((fr) => (
                  <div
                    key={fr?._id || fr?.userId}
                    onClick={() => handleCreateNewChat(fr._id)}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={fr.avatar || avatar}
                      className="w-10 h-10 rounded-full"
                      alt={fr.name}
                    />
                    <span className="text-base">{fr.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="left__subtitle">Tin nhắn</div>
          <div className="left__list-chatted">
            {listUserChat && listUserChat.length > 0 ? (
              listUserChat.map(
                (item) =>
                  item &&
                  item.userId && (
                    <div
                      key={item._id || item.userId}
                      className={`chatted-card ${
                        currentReceiverId === item.userId ? "active" : ""
                      }`}
                      onClick={() => clickViewMessageSegment(item.userId)}
                    >
                      <div className="avatar-user">
                        <img src={item.avatar || avatar} alt={item.name} />
                      </div>
                      <div className="detail-chat">
                        <div className="name">{item.name || "Người dùng"}</div>
                        <div className="last-chat">
                          <div className="chat">{item.lastMessage || ""}</div>
                          <div className="time-ago">
                            {item?.time?.split?.("T")?.[1]?.slice(0, 5) ||
                              "00:00"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )
            ) : (
              <div className="text-center py-4 text-gray-500">
                Chưa có tin nhắn
              </div>
            )}
          </div>
        </div>

        <div
          className={`message-content__center ${
            showDetail ? "half" : "seventyfive"
          }`}
        >
          <div className="center__header">
            {currentChatPartner && (
              <>
                <div className="header__info">
                  <div className="avatar-user">
                    <img
                      src={currentChatPartner.avatar || avatar}
                      alt={currentChatPartner.name}
                    />
                  </div>
                  <div className="name">{currentChatPartner.name}</div>
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
                {messageSegment.map((msg, index) => {
                  const normalizedSenderId = getNormalizedId(msg.senderId);
                  const normalizedUserId = userId.toString();
                  const isMyMessage = normalizedSenderId === normalizedUserId;

                  return (
                    <div
                      key={msg._id || index}
                      className={`message-row ${
                        isMyMessage ? "right" : "left"
                      }`}
                    >
                      {!isMyMessage && (
                        <div className="img-receiver">
                          <img
                            src={
                              typeof msg.senderId === "object"
                                ? msg.senderId.avatar
                                : avatar
                            }
                            alt={
                              typeof msg.senderId === "object"
                                ? msg.senderId.name
                                : "Người dùng"
                            }
                          />
                        </div>
                      )}

                      {isMyMessage && (
                        <span
                          className="options"
                          onClick={() => handleDeleteChat(msg?._id)}
                        >
                          <i className="fa-solid fa-ellipsis w-3"></i>
                          {selectedIdDelete === msg._id && (
                            <div className="mini-delete-modal">
                              <div
                                className="mini-delete-item cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirmDelete(msg?._id);
                                }}
                              >
                                Xoá tin nhắn
                              </div>
                              <div
                                className="mini-delete-item cancel cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedIdDelete("");
                                }}
                              >
                                Huỷ
                              </div>
                            </div>
                          )}
                        </span>
                      )}

                      <div className="bubble">
                        {msg.message && (
                          <div className="message-text">{msg.message}</div>
                        )}

                        {msg.media && msg.media.length > 0 && (
                          <div className="media-list">
                            {msg.media.map((file, idx) =>
                              file.type === "image" ? (
                                <img
                                  src={file.url}
                                  key={file._id || idx}
                                  className="chat-media"
                                  alt=""
                                />
                              ) : file.type === "video" ? (
                                <video
                                  key={file._id || idx}
                                  controls
                                  className="chat-media"
                                >
                                  <source src={file.url} type="video/mp4" />
                                </video>
                              ) : null
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {renderSelectedFilesPreview()}

              <div className="center__send">
                <div className="input-frame">
                  <div className="icon-message">
                    <i className="fa-solid fa-envelope text-blue-500 text-xl"></i>
                  </div>
                  <input
                    type="text"
                    placeholder={
                      selectedFiles.length > 0
                        ? "Nhập tin nhắn (tùy chọn)..."
                        : "Tin nhắn ...."
                    }
                    value={formSendMess["message"]}
                    onChange={(e) =>
                      setFormSendMess((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    disabled={isUploading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !e.repeat) {
                        e.preventDefault();
                        debouncedSendMessage();
                      }
                    }}
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
                        onClick={debouncedSendMessage}
                      ></i>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">TIN NHẮN</span>
              <i className="fa-regular fa-message text-5xl mt-2"></i>
              <p className="mt-4 text-gray-600">
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
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
