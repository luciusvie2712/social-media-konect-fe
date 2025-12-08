import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import avatar from "../../assets/download.png";
import { getConversation, sendMessage, getListUserChatted } from "../../utils/api.customize";
import { toast } from "react-toastify";
import { createSocket } from "../../socket/socket";
import _ from "lodash";

const MiniChat = () => {
  const user = useSelector((state) => state.user.account);
  const userId = user?.id;
  
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [listUserChat, setListUserChat] = useState([]);
  const [messageSegment, setMessageSegment] = useState([]);
  const [currentReceiverId, setCurrentReceiverId] = useState("");
  const [currentReceiverInfo, setCurrentReceiverInfo] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const chatBodyRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Lắng nghe sự kiện mở chat từ các component khác (RightSideBar)
  useEffect(() => {
    const handleOpenMiniChat = (event) => {
      const { friendId, friendData } = event.detail;
      
      // Mở MiniChat nếu đang đóng
      if (!isOpen) {
        setIsOpen(true);
      }
      
      // Load conversation với bạn bè được click
      clickViewMessageSegment(friendId, friendData);
    };

    window.addEventListener('openMiniChat', handleOpenMiniChat);
    
    return () => {
      window.removeEventListener('openMiniChat', handleOpenMiniChat);
    };
  }, [isOpen]);

  // Tải danh sách đoạn chat
  useEffect(() => {
    if (userId && isOpen) {
      getListUser();
    }
  }, [userId, isOpen]);

  const getListUser = async () => {
    try {
      let res = await getListUserChatted(userId);
      if (res?.Ec === 0) {
        setListUserChat(res.users);
      } else {
        toast.error(res?.Mes);
      }
    } catch (error) {
      console.error("Error loading chat list:", error);
    }
  };

  // Socket cho realtime chat
  useEffect(() => {
    if (!userId || !isOpen) return;
    
    const socket = createSocket(userId);
    
    socket.on("receive_message", (data) => {
      const message = data.newMess;
      
      // Nếu đang trong chat với người gửi
      if (currentReceiverId && 
          (message.senderId === currentReceiverId || message.receiverId === currentReceiverId)) {
        setMessageSegment(prev => [...prev, message]);
        scrollToBottom();
      }
      // Cập nhật danh sách chat realtime
      updateChatRealTime(message);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [userId, isOpen, currentReceiverId]);

  const updateChatRealTime = (message) => {
    const chatPartnerId = message.senderId === userId ? message.receiverId : message.senderId;
    setListUserChat(prev => {
      const existing = prev.find(item => item.userId === chatPartnerId);
      const others = prev.filter(item => item.userId !== chatPartnerId);
      
      const updatedChat = {
        userId: chatPartnerId,
        name: existing?.name || message.senderId?.name || "Người dùng",
        avatar: existing?.avatar || message.senderId?.avatar || avatar,
        lastMessage: message.message || "Đã gửi một ảnh",
        time: new Date().toISOString(),
      };
      
      return [updatedChat, ...others];
    });
  };

  // Xem đoạn chat cụ thể
  const clickViewMessageSegment = async (receiverId, userInfo) => {
    setCurrentReceiverId(receiverId);
    setCurrentReceiverInfo(userInfo);
    setSelectedFiles([]); // Reset selected files khi chuyển người chat
    
    try {
      const res = await getConversation(userId, receiverId);
      if (res?.Ec === 0) {
        setMessageSegment(res.dataMes);
        scrollToBottom();
      } else if (res?.Ec === -2 || res?.Mes === "Not found") {
        // Chưa có đoạn chat, tạo mới
        setMessageSegment([]);
      } else {
        toast.error(res?.Mes);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast.error("Không thể tải đoạn chat");
    }
    
    setTimeout(() => {
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }, 100);
  };

  const handleFileSelect = (e) => {
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

  // Gửi tin nhắn (có thể kèm ảnh)
  const handleSendMessage = async () => {
    if ((!messageInput.trim() && selectedFiles.length === 0) || !currentReceiverId) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("senderId", userId);
    formData.append("message", messageInput);
    formData.append("receiverId", currentReceiverId);
    
    // Thêm tất cả file ảnh vào formData
    selectedFiles.forEach(fileItem => {
      formData.append("media", fileItem.file);
    });
    
    try {
      let res = await sendMessage(formData);
      if (res?.Ec === 0) {
        // Reset form
        setMessageInput("");
        setSelectedFiles([]);
        scrollToBottom();
        // Cập nhật last message trong danh sách
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
    if (!currentReceiverInfo) return;
    
    const lastMessage = selectedFiles.length > 0 
      ? `Đã gửi ${selectedFiles.length} ảnh${messageInput ? ' và tin nhắn' : ''}`
      : messageInput;
    
    setListUserChat(prev => {
      const existing = prev.find(item => item.userId === currentReceiverId);
      const others = prev.filter(item => item.userId !== currentReceiverId);
      
      const updatedChat = {
        userId: currentReceiverId,
        name: currentReceiverInfo.name || "Người dùng",
        avatar: currentReceiverInfo.avatar || avatar,
        lastMessage,
        time: new Date().toISOString(),
      };
      
      return [updatedChat, ...others];
    });
  };

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      requestAnimationFrame(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      });
    }
  };

  // Mở danh sách chat (khi click vào button chat bubble)
  const openChatList = () => {
    setIsOpen(true);
    // Giữ nguyên current chat nếu đang có
  };

  // Đóng hoàn toàn
  const handleCloseChat = () => {
    setIsOpen(false);
    // Reset current chat khi đóng
    setCurrentReceiverId("");
    setCurrentReceiverInfo(null);
    setMessageSegment([]);
    setSelectedFiles([]);
  };

  // Mở chat với người khác từ danh sách
  const openChatWithUser = (user) => {
    clickViewMessageSegment(user.userId, user);
  };

  // Xử lý phím Enter để gửi
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Lấy tên hiển thị
  const getDisplayName = () => {
    if (currentReceiverInfo?.name) return currentReceiverInfo.name;
    if (messageSegment[0]?.receiverId?.name) return messageSegment[0].receiverId.name;
    return "Người dùng";
  };

  // Lấy avatar hiển thị
  const getDisplayAvatar = () => {
    if (currentReceiverInfo?.avatar) return currentReceiverInfo.avatar;
    if (messageSegment[0]?.receiverId?.avatar) return messageSegment[0].receiverId.avatar;
    return avatar;
  };

  // Render preview ảnh đã chọn
  const renderSelectedFilesPreview = () => {
    if (selectedFiles.length === 0) return null;
    
    return (
      <div className="p-1 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Đã chọn {selectedFiles.length} ảnh
          </span>
          <button
            onClick={() => setSelectedFiles([])}
            className="text-sm! text-red-500 hover:text-red-700"
          >
            Xóa tất cả
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedFiles.map(fileItem => (
            <div key={fileItem.id} className="relative group">
              <img
                src={fileItem.preview}
                alt={fileItem.name}
                className="w-10 h-10 object-cover rounded border border-gray-300"
              />
              <button
                onClick={() => removeSelectedFile(fileItem.id)}
                className="absolute -top-2 -right-2 w-8 h-8 text-white rounded-full text-xs flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render nút mở chat (khi đóng)
  const renderChatBubble = () => (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={openChatList}
        className="w-14 h-14 bg-blue-400 text-white rounded-full! shadow-lg hover:bg-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <i className="fas fa-comment-dots text-xl"></i>
      </button>
    </div>
  );

  // Render cửa sổ chat (khi mở)
  const renderChatWindow = () => {
    // Nếu đang có current chat, hiển thị khung chat
    if (currentReceiverId) {
      return (
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="w-full flex items-center justify-between px-2 py-2 border-b bg-white border-gray-200">
            <div className="flex items-center w-full">
              <div className="flex items-center gap-2">
                <img
                  src={getDisplayAvatar()}
                  alt={getDisplayName()}
                  className="w-8 h-8 rounded-full mr-3 object-cover"
                />
                <span className="font-medium text-[20px]">{getDisplayName()}</span>
              </div>
            </div>
            <button
              onClick={handleCloseChat}
              className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded-full! hover:bg-gray-200"
            >
              <i className="fa-regular fa-circle-xmark"></i>
            </button>
          </div>

          {/* Nội dung chat */}
          <div 
            ref={chatBodyRef}
            className="flex-1 overflow-y-auto p-3 bg-gray-50"
          >
            {messageSegment.length > 0 ? (
              messageSegment.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'} mb-1`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      msg.senderId === userId
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.message && <p className="text-sm mb-2!">{msg.message}</p>}
                    {msg.media && msg.media.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.media.map((file, idx) => (
                          <div key={file._id || idx} className="mt-1">
                            {file.type === 'image' ? (
                              <img
                                src={file.url}
                                alt=""
                                className="max-w-full h-auto rounded max-h-40 object-cover"
                              />
                            ) : file.type === 'video' ? (
                              <video
                                controls
                                className="max-w-full h-auto rounded max-h-40"
                              >
                                <source src={file.url} />
                              </video>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={`text-xs ${msg.senderId === userId ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt || msg.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <i className="fas fa-user-friends text-blue-500 text-2xl"></i>
                </div>
                <h4 className="font-medium text-lg mb-1">{getDisplayName()}</h4>
                <p className="text-gray-500 text-sm text-center">Bắt đầu cuộc trò chuyện với {getDisplayName()}</p>
              </div>
            )}
          </div>

          {/* Preview ảnh đã chọn */}
          {renderSelectedFilesPreview()}

          {/* Input */}
          <div className="border-t p-2 bg-white border-gray-200">
            <div className="flex items-center gap-2">
              {/* Nút chọn ảnh */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full! flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
                disabled={isUploading}
              >
                <i className="fas fa-image text-lg"></i>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              
              <input
                ref={messageInputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedFiles.length > 0 ? "Nhập tin nhắn (tùy chọn)..." : "Nhập tin nhắn..."}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isUploading}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={(!messageInput.trim() && selectedFiles.length === 0) || isUploading}
                className={`ml-2 w-10 h-10 rounded-full! flex items-center justify-center transition-colors ${
                  (messageInput.trim() || selectedFiles.length > 0) && !isUploading
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isUploading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane text-sm"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Nếu không có current chat, hiển thị danh sách
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-gray-200 px-2 py-3">
          <span className="font-bold text-[20px]">Đoạn chat</span>
          <button
            onClick={handleCloseChat}
            className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded-full! hover:bg-gray-200"
          >
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {listUserChat.length > 0 ? (
            listUserChat.map((item) => (
              <div
                key={item.userId}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 gap-2"
                onClick={() => openChatWithUser(item)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={item.avatar || avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm truncate">{item.name}</span>
                    <span className="text-xs text-gray-500">
                      {item.time ? new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 truncate mt-1">
                    {item.lastMessage || "Bắt đầu cuộc trò chuyện"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <i className="fas fa-comments text-3xl mb-3 text-gray-300"></i>
              <p>Chưa có đoạn chat nào</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render chính
  if (!isOpen) {
    return renderChatBubble();
  }

  return (
    <div className="fixed bottom-10 right-10 z-50 animate-fade-in">
      <div className="w-90 h-110 bg-white rounded shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
        {renderChatWindow()}
      </div>
    </div>
  );
};

export default MiniChat;