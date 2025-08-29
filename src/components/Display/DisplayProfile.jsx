import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getAUserByIdAPI } from "../../utils/api.customize"
import { toast } from "react-toastify"


const DisplayProfile = () => {
    const [ userData, setUserData ] = useState(null)
    const user = useSelector((state) => state.user.account)

    useEffect(() => {
        const fetchAUser = async () => {
            try {
                if (!user?.id) return 
                const res = await getAUserByIdAPI(user.id)
                console.log(res)
                if (res.Ec === 0) {
                    setUserData(res.data)
                } else {
                    toast.warning(res.Mes)
                }
            } catch (error) {
                toast.error("Error went load data")
            }
        }
        fetchAUser()
    }, [user?.id])
    return (
        <div className="w-[100%] h-screen overflow-auto flex flex-col items-center">
            {userData ? (
                <p>{userData.name}</p>
            ) : (
                <p>Loading ...</p>
            )}
        </div>
    )
}

export default DisplayProfile