import React from "react";
import "./userinfo.css";
import useUserStore from "../../../lib/userStore";

function UserInfo() {

   const {currentUser} = useUserStore();
   
  return (
    <div className="userInfo">
      <div className="user">
        <img className="userImg" src={currentUser.avatar || "../public/avatar.png"} alt="" />
        <h3>{currentUser.username}</h3>
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
