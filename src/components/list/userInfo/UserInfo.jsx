import React from "react";
import "./userinfo.css";

function UserInfo() {
  return (
    <div className="userInfo">
      <div className="user">
        <img src="../public/avatar.png" alt="" />
        <h3>John Doe</h3>
        <div className="icons">
          <img src="../public/video.png" alt="" />
          <img src="../public/more.png" alt="" />
          <img src="../public/edit.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
