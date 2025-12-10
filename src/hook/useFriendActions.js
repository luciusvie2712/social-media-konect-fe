import { useState } from "react"
import { sendFriendRequest, rejectFriendRequest, acceptFriendRequest, unFriend } from "../utils/api.customize"

export const useFriendActions = () => {
    const [status, setStatus] = useState('idle')

    const handleSendFriendRequest = async (requesterId, recipientId) => {
        try {
            const res = await sendFriendRequest(requesterId, recipientId)
            if (res.Ec === 0) {
                setStatus("success")
            }
            return res
        } catch (error) {
            setStatus('idle')
            throw error
        }
    }
    const handleAcceptFriendRequest = async (requesterId, recipientId) => {
        try {
            const dataRes = await acceptFriendRequest(requesterId, recipientId)
            if (dataRes.Ec === 0) {
                setStatus("accepted")
            } else {
                console.warn(">>> Warning: ", dataRes?.Mes)
            }
            return dataRes
        } catch (error) {
            setStatus('idle')
            throw error
        }
    }

    const handleRejectFriendRequest = async (requesterId, recipientId) => {
        try {
            setStatus("loading")
            const res = await rejectFriendRequest(requesterId, recipientId)
            if (res?.Ec === 0) {
                setStatus("rejected")
            } else {
                setStatus("idle")
            }
            return res
        } catch (error) {
            setStatus("idle")
            throw error
        }
    }


    return { status, handleSendFriendRequest, handleAcceptFriendRequest, handleRejectFriendRequest }
}


