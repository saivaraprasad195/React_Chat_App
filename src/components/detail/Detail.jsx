import React from "react";
import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/useChatStore";
import useUserStore from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

function Detail() {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleBlockUser = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {}
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user.avatar || "./avatar.png"} alt="" />
        <h2>{user.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="photos">
            <div className="option">
            </div>
            <button onClick={handleBlockUser}>
              {isCurrentUserBlocked
                ? "You are Blocked!"
                : isReceiverBlocked
                ? "User Blocked"
                : "Block User"}
            </button>
            <button className="logout" onClick={() => auth.signOut()}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
