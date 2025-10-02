import { useState } from "react"
import { getFriendRequest, sendFriendRequest } from "../utils/api.customize"

export const useFriendRequest = () => {
    const [status, setStatus] = useState('idle')

    const handleSendFriendRequest = async (requesterId, recipientId) => {
        try {
            const res = await sendFriendRequest(requesterId, recipientId)
            console.log(">> gui loi moi ket ban") 
            setStatus("success")
            return res
        } catch (error) {
            setStatus('idle')
            throw error
        }
    }

    return { status, handleSendFriendRequest }
}


