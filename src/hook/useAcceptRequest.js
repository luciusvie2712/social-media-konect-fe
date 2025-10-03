import { useState } from "react"
import { acceptFriendRequest } from "../utils/api.customize"

export const useAcceptRequest = () => {
    const [status, setStatus] = useState('idle')

    const handleAcceptFriendRequest = async (requesterId, recipientId) => {
        try {
            const dataRes = await acceptFriendRequest(requesterId, recipientId)
            console.log(">>> Data Accepted: ", dataRes)
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
    return { status, handleAcceptFriendRequest }
}