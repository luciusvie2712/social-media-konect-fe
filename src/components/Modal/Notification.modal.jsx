import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotifications, maskAsReadAPI } from "../../utils/api.customize";

const NotificationModal = (props) => {
  const { show, setShow } = props;
  const user = useSelector((state) => state.user.account)
  const [ notifications, setNotification ] = useState([])
  const [ error, setError ] = useState(null)
  const [showAll, setShowAll] = useState(false);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-20 z-50"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#222] border border-[#494949] rounded-2xl shadow-lg w-[380px] max-h-[70vh] overflow-y-auto text-white p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Thông báo</h2>
              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-gray-200 transition"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="flex flex-col divide-y divide-[#494949] overflow-auto">
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
                            src={n.senderId?.avatar || "/default-avatar.png"}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
