import { useEffect, useState } from "react";
import { getAUserByIdAPI, checkRelationShip } from "../../utils/api.customize";
import { toast } from "react-toastify";
import "../../styles/ProfilePage.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DisplayProfile from "../../components/Profile/DisplayProfile";

const ProfilePage = ({ data = null, type = null, compact }) => {
  const { id } = useParams()
  const user = useSelector((state) => state.user.account)
  const [profileData, setProfileData] = useState(null)
  const [relationship, setRelationship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relationshipLoading, setRelationshipLoading] = useState(false)
  const [mode, setMode] = useState("all")

  const determineMode = (relationshipStatus, isOwner) => {
    if (isOwner) return "owner"
    
    switch (relationshipStatus?.status) {
      case "accepted":
        return "friend"
      case "pending":
        const isRequester = relationshipStatus?.requester === user?.id
        return isRequester ? "pending_outgoing" : "pending_incoming"
      case "rejected":
        return "stranger"
      default:
        return "stranger"
    }
  };

  const fetchRelationship = async (userId, otherUserId) => {
    if (!userId || !otherUserId || userId === otherUserId) return null;
    
    try {
      setRelationshipLoading(true);
      const res = await checkRelationShip(userId, otherUserId);
      console.log("fetch", res)
      if (res) {
        setRelationship(res);
        return res;
      }
      return null;
    } catch (error) {
      console.error("Error fetching relationship:", error);
      return null;
    } finally {
      setRelationshipLoading(false);
    }
  };

  // Xử lý khi có data truyền vào từ props
  useEffect(() => {
    if (!data) return 
    const loadDataFromProps = async () => {
      setLoading(true)

      try {
        const fetched = await getAUserByIdAPI(data._id || data.id)
        console.log("fetch:", fetched)
        const fetchedUser = fetched?.data

        if (!fetchedUser) {
          toast.error("Không tìm thấy người dùng")
          return
        }
        const normalized = { 
          ...fetchedUser, 
          id: fetchedUser._id || fetchedUser.id 
        }

        setProfileData(normalized)
        if (type !== "owner" && user?.id && normalized.id !== user.id) {
          const rel = await fetchRelationship(user.id, normalized.id);
          setMode(determineMode(rel, false));
        } else {
          setMode("owner");
        }
      } catch (error) {
        console.error(error)
        toast.error("Lỗi khi tải profile (props mode)")
      } finally {
        setLoading(false)
      }
    }

    loadDataFromProps()
  }, [data, type, user]);

  // Xử lý khi không có data từ props, lấy từ URL params
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);

      try {
        const targetId = id || user?.id;

        const userRes = await getAUserByIdAPI(targetId);
        const fetchedUser = userRes?.data || null;

        if (!fetchedUser) {
          toast.error("Không tìm thấy người dùng");
          setProfileData(null);
          setMode("stranger");
          return;
        }

        const fetchId = {
          ...fetchedUser,
          id: fetchedUser.id || fetchedUser._id,
        };

        setProfileData(fetchId);

        if (targetId === user?.id) {
          setMode("owner");
        } 
        else if (user?.id) {
          const rel = await fetchRelationship(user.id, targetId);
          const calculatedMode = determineMode(rel, false);
          setMode(calculatedMode);
        } 
        else {
          setMode("stranger");
        }

      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Có lỗi xảy ra khi tải thông tin");
        setProfileData(null);
        setMode("stranger");
      } finally {
        setLoading(false);
      }
    };

    if (!data) {
      loadProfileData();
    }
  }, [id, user, data]);


  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
            <i className="fa-solid fa-user-slash text-4xl text-gray-400"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Người dùng không tồn tại</h2>
          <p className="text-gray-500">Không thể tìm thấy thông tin người dùng này.</p>
        </div>
      </div>
    );
  }

  if (relationshipLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center">
        <DisplayProfile 
          info={profileData} 
          mode={mode}
          relationship={relationship}
          isLoadingRelationship={true}
        />
      </div>
    );
  }
  console.log("profile Data: ", profileData)

  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto">
      <DisplayProfile 
        info={profileData} 
        mode={mode}
        relationship={relationship}
        onRelationshipUpdate={(newRelationship) => {
          setRelationship(newRelationship);
          const newMode = determineMode(newRelationship, false);
          setMode(newMode);
        }}
        compact={compact}
      />
    </div>
  );
};

export default ProfilePage;