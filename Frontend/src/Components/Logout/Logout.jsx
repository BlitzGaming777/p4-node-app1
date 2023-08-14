import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    console.log("handleLogout clicked");
    // Set loggingOut to true to display the confirmation message
    setLoggingOut(true);
  };

  const handleConfirmLogout = () => {
    console.log("handleConfirmLogout clicked");

    navigate("/");
  };

  const handleCancel = () => {
    console.log("handleCancel clicked");
    // Redirect back to the main page without logging out
    navigate("/main");
  };
  console.log("loggingOut:", loggingOut);
  return (
    <div className="logout-modal-container">
      <div className="logout-modal">
        <div className="logout-form">
          <p style={{ color: "red" }}>Are you sure you want to log out?</p>
          <div className="logout-modal-buttons">
            <button className="yes-btn" onClick={handleConfirmLogout}>
              Yes
            </button>
            <button className="no-btn" onClick={handleCancel}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logout;
