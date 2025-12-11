import { io } from "socket.io-client";

let socket;
const urlBackend = import.meta.env.VITE_URL_BACKEND
export const createSocket = (userId) => {

    socket = io(urlBackend, {

        withCredentials: true,
        auth: {
            userId,
        },
    });
    socket.on("connect", () => {
        console.log("Socket connected to server");
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) throw new Error("Socket chưa được khởi tạo");
    return socket;
};
