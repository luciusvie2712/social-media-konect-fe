import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotifications } from "../../utils/api.customize";

const NotificationModal = (props) => {
  const { show, setShow } = props;
  const user = useSelector((state) => state.user.account)
  const [ notifications, setNotification ] = useState([])
  const [ error, setError ] = useState(null)

  useEffect(() => {
    if (!show || !user?.id) return 
    const fetchNotifications = async () => {
      setError(null)
      try {
        const response = await getNotifications(user?.id)
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

    fetchNotifications()
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
                <div className="">Không có thông báo</div>
              ) : notifications.map((n, i) => (
                <div
                  key={n._id || i}
                  className="flex px-2 py-2 hover:bg-[#686868] cursor-pointer justify-between items-center h-[50px]" 
                >
                  <div className="flex items-center gap-2">
                    <img src={n.senderId.avatar} className="" />
                    <div className="">{n.senderId.name} đã {n.type} bài viết của bạn</div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {timeAgo(n?.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
