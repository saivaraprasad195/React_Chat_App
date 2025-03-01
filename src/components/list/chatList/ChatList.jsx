import React, { useEffect, useState } from "react";
import AddUser from "./addUser/AddUser";
import "./chatList.css";
import useUserStore from "../../../lib/userStore";
import { useChatStore } from "../../../lib/useChatStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "react-toastify";

function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res?.data()?.chats;
        if (items) {
          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
            const user = userDocSnap.data();
            return { ...item, user };
          });

          const chatData = await Promise.all(promises);
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    // we get the index of ChatId user selected from userChats array to set isSeen to true
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user, currentUser);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.user.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="searchContainer">
        <div className="searchBar">
          <img src="../public/search.png" alt="" />
          <input
            type="text"
            name="User"
            id=""
            placeholder="Search"
            onChange={(e) => {
              setUserSearch(e.target.value);
            }}
          />
        </div>
        <img
          src={addMode ? "/minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => {
            handleSelect(chat);
          }}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img
            src={
              chat?.user?.blocked?.includes(currentUser.id)
                ? "/avatar.png"
                : chat?.user?.avatar || "/avatar.png"
            }
            alt=""
          />
          <div className="text">
            <span>{chat?.user?.username}</span>
            <p>{chat?.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser setAddMode={setAddMode} />}
    </div>
  );
}

export default ChatList;
