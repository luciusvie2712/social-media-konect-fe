import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotifications, maskAsReadAPI } from "../../utils/api.customize";
import avatar from '../../assets/download.png'

const NotificationModal = (props) => {
  const { show, setShow } = props;
  const user = useSelector((state) => state.user.account)
  const [ notifications, setNotification ] = useState([])
  const [ error, setError ] = useState(null)
  const [showAll, setShowAll] = useState(false)
  useEffect(() => {
    if (!show) return;
    const close = (e) => {
      if (!e.target.closest(".notification-modal")) setShow(false);
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", close);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", close);
    };
  }, [show]);


  const fetchNotifications = async (userId) => {
    setError(null)
    try {
      const response = await getNotifications(userId)
      console.log(">> Notifications: ",response)
      if (response?.Ec === 0) {
        setNotification(response?.data || [])
      } else {
        console.warn(response?.Mes)
      }
    } catch (error) {
      console.error("Unable to load notification", error)
      setError("Unable to load notification")
    }
  }
  useEffect(() => {
    if (user?.id && show === true) {
      fetchNotifications(user?.id)
    }
  }, [show, user?.id])

  const timeAgo = (createdAt) => {
    const now = new Date();
    const past = new Date(createdAt);
    const diff = (now - past) / 1000;

    if (diff < 60) return `${Math.floor(diff)} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} tháng trước`;
    return `${Math.floor(diff / 31536000)} năm trước`;
  };

  const maskAsRead = async (notiId) => {
    if (!notiId) {
      return console.warn("Error get notiId")
    } 
    let res = await maskAsReadAPI(notiId)
    if (res?.Ec === 0) {
      fetchNotifications(user.id)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className="notification-modal fixed left-[16%] h-[95vh] rounded bg-[#222] border-[1px] border-[#494949] w-[380px] text-white flex flex-col z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-[#494949]">
            <h2 className="text-lg font-semibold">Thông báo</h2>
            <button
              onClick={() => setShow(false)}
              className="text-gray-400 hover:text-gray-200 transition"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#494949] p-2">
            {error ? (
              <div className="text-center py-6 text-red-400">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-6 text-gray-400">Không có thông báo</div>
            ) : (
              <>
                {notifications
                  .slice(0, showAll ? notifications.length : 9)
                  .map((n, i) => (
                    <div
                      key={n._id || i}
                      className={`flex px-2 py-2 hover:bg-[#2e2e2e] cursor-pointer justify-between items-center transition ${n.isRead ? "opacity-50" : "opacity-100"}`}
                      onClick={() => maskAsRead(n._id)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={n.senderId?.avatar || avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex flex-col text-sm">
                          <span>
                            <span className="font-semibold">{n.senderId?.name}</span>{" "}
                            {n.type === "like"
                              ? "đã thích bài viết của bạn"
                              : n.type === "comment"
                              ? "đã bình luận bài viết của bạn"
                              : n.type === "friend_request"
                              ? "đã gửi yêu cầu kết bạn"
                              : n.type === "friend_accept"
                              ? "đã chấp nhận yêu cầu kết bạn"
                              : ""}
                          </span>
                          <span className="text-xs text-gray-400">
                            {timeAgo(n?.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                {!showAll && notifications.length > 9 && (
                  <div className="flex justify-center mt-3">
                    <button
                      onClick={() => setShowAll(true)}
                      className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2 transition"
                    >
                      Xem tất cả thông báo
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

  );
};

export default NotificationModal;
