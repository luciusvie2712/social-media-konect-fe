import { motion, AnimatePresence } from "framer-motion";

const NotificationModal = (props) => {
  const { show, setShow, user } = props;
  console.log("sss", show);
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
            <div className="flex flex-col divide-y divide-[#494949]">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="py-3 px-2 hover:bg-[#2c2c2c] rounded-lg cursor-pointer flex items-start gap-3 transition"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                    className="w-9 h-9 rounded-full"
                    alt="avatar"
                  />
                  <div className="flex-1 text-sm">
                    <span className="font-semibold">Người dùng {i + 1}</span>{" "}
                    đã thích bài viết của bạn.
                    <div className="text-xs text-gray-400 mt-1">
                      5 phút trước
                    </div>
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
