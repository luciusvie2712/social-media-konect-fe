import { useState } from "react";
import "./logo.scss";
import { createLogo } from "../../../utils/api.customize";
import { toast } from "react-toastify";

const CreateLogo = () => {
  const [logoImage, setLogoImage] = useState(null);
  const [logoPrev, setLogoPrev] = useState(null);

  const handleChooseFileLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoImage(file);
    setLogoPrev(URL.createObjectURL(file));
  };

  const handleCreateLogo = async () => {
    if (!logoImage) {
      toast.error("Please choose a logo first.");
      return;
    }

    const formdata = new FormData();
    formdata.append("logo", logoImage);

    const res = await createLogo(formdata);

    if (res?.Ec === 0) {
      toast.success(res.Mes);
      setLogoImage(null);
      setLogoPrev(null);
    } else {
      toast.error(res?.Mes);
    }
  };

  return (
    <div className="logo-container">
      <h2 className="header-manage-logo">Website Settings</h2>

      <div className="logo-box">
        <div className="left-info">
          <h3>Website Logo</h3>
          <span>Current Logo</span>

          <div className="current-logo-preview">
            {logoPrev ? (
              <img src={logoPrev} alt="logo preview" />
            ) : (
              <div className="no-logo"></div>
            )}
          </div>
          {logoPrev && (
            <span className="clear-btn" onClick={() => setLogoPrev(null)}>
              Remove Preview ✕
            </span>
          )}
        </div>

        <div className="right-upload">
          <h3>Upload New Logo</h3>

          <label htmlFor="logo" className="upload-area">
            <div className="upload-text">
              <strong>Click to upload</strong> or drag and drop <br />
              SVG, PNG, JPG (MAX. 800×400px)
            </div>
          </label>

          <input
            type="file"
            id="logo"
            hidden
            accept="image/*"
            onChange={handleChooseFileLogo}
          />
        </div>
      </div>

      <button onClick={handleCreateLogo} className="save-btn">
        Save Changes
      </button>
    </div>
  );
};

export default CreateLogo;
