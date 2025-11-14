import { useEffect, useState } from "react";
import { getAUserByIdAPI } from "../../utils/api.customize";
import { toast } from "react-toastify";
import avatar from "../../assets/download.png";
import "../../styles/Profile.scss";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const [ userData, setUserData ] = useState([])
  const { id } = useParams()
  console.log(">>>> User: ", userData)

  useEffect(() => {
    const fetchAUser = async () => {
      try {
        if (!id) return;
        const res = await getAUserByIdAPI(id);
        console.log(res);
        if (res.Ec === 0) {
          setUserData(res.data);
        } else {
          toast.warning(res.Mes);
        }
      } catch (error) {
        toast.error("Error went load data");
      }
    };
    fetchAUser();
  }, [id]);

  return (
    <div className="w-full h-screen flex items-center text-black">
      <span>{userData?.name}</span>
    </div>
  );
};

export default ProfilePage;
