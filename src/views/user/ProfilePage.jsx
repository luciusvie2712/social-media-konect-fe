import { useEffect, useState } from "react";
import { getAUserByIdAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";
import "../../styles/ProfilePage.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DisplayProfile from "../../components/Profile/DisplayProfile";
import { checkRelationShip } from "../../utils/api.customize";

const ProfilePage = ({data, type = null}) => {
  const { id } = useParams()
  const user = useSelector((state) => state.user.account)
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(false)

  

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const res = await getAUserByIdAPI(id)
        setOtherUser(res?.data || null)
      } catch (error) {
        setOtherUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id, data, user?.id])

  let displayContent


  if (loading) displayContent = <div>Loading ...</div>
  else if (data) displayContent = <DisplayProfile info={data} mode={type} />
  else if (!id || id === user?.id) displayContent = <DisplayProfile info={user} mode="owner" />
  else if (otherUser) displayContent = <DisplayProfile info={otherUser} mode="all" />;
  else displayContent = <p>User not found</p>

  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto">
      {displayContent}
    </div>
  )
}

export default ProfilePage
