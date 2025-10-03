import { useEffect, useState } from "react"
import { getFriendRequest, GetfriendSuggestion, getListFriends } from "../utils/api.customize"

export const useFriendList = (type, userId) => {
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchFriend = async () => {
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
                    dataRes = { 
                        Ec: 1,
                        Mes: "Type is not valid"
                    }
            }
            if  (dataRes.Ec === 0) {
                setFriends(dataRes.data)
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

    return { friends, loading, refetch: fetchFriend }
}