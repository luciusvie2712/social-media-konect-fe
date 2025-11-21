import { useState } from "react";
import "./logo.scss";
import { createLogo } from "../../../utils/api.customize";
import { toast } from "react-toastify";
const CreateLogo = () => {
  const [logoImage, setLogoImage] = useState();
  const [logoPrev, setLogoPrev] = useState();
  const formdata = new FormData();
  formdata.append("logo", logoImage);
  const handleChooseFileLogo = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    console.log(file);
    setLogoImage(file);
    setLogoPrev(URL.createObjectURL(file));
  };
  const handleCreateLogo = async () => {
    const res = await createLogo(formdata);
    if (res?.Ec === 0) {
      toast.success(res.Mes);
      setLogoImage("");
      setLogoPrev("");
    } else {
      toast.error(res?.Mes);
    }
  };
  return (
    <>
      <div className="logo-container">
        <span className="header-manage-logo">Update New Logo</span>
        <div className="logo-main">
          <div className="">
            <label htmlFor="logo">Choose file logo</label>
            <input
              type="file"
              id="logo"
              hidden
              accept="image/*"
              onChange={(e) => handleChooseFileLogo(e)}
            />
          </div>
          <div className="logo-prev">
            {logoPrev ? (
              <>
                <span
                  className="button-clean-logo"
                  onClick={() => {
                    setLogoPrev(null);
                  }}
                >
                  X
                </span>
                <img src={logoPrev} />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <button onClick={handleCreateLogo} className="button-confirm-logo">
          Confirm Change logo
        </button>
      </div>
    </>
  );
};
export default CreateLogo;
