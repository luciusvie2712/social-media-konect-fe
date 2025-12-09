import { useEffect, useState } from "react"
import { getFriendRequest, GetfriendSuggestion, getListFriends } from "../utils/api.customize"

export const useFriendList = (type, userId) => {
    const [friends, setFriends] = useState([])
    const [raw, setRaw] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchFriend = async () => {
        if (!userId) return
        setLoading(true)
        try {
            let dataRes
            switch (type) {
                case "request":
                    dataRes = await getFriendRequest(userId)
                    break
                case "suggestion":
                    dataRes = await GetfriendSuggestion(userId)
                    break
                case "all":
                    dataRes = await getListFriends(userId)
                    break
                default:
                    console.warn("Invalid type in useFriendList:", type)
                    setFriends([])
                    return
            }

            if (dataRes?.Ec === 0) {
                const data = dataRes?.data
                setRaw(data)
                if (type === "suggestion") {
                    const merged = [
                        ...(data.friendOfFriendSuggestions || []),
                        ...(data.sameCitySuggestions || [])
                    ]
                    setFriends(merged)
                } else if (type === "request") {
                    const list = (data || []).map(item => item.requester)
                    setFriends(list)
                } else {
                    setFriends(data || [])
                }
            } else {
                console.warn(">>> API Error: ", dataRes?.Mes)
                setFriends([])
            }
        } catch (error) {
            console.error(">>> Fetch friends error: ", error)
            setFriends([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) fetchFriend()
    }, [type, userId])

    return { friends, raw, loading, refetch: fetchFriend }
}