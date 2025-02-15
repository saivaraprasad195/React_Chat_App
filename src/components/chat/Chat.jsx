import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/useChatStore";
import { toast } from "react-toastify";
import useUserStore from "../../lib/userStore";
import upload from "../../lib/upload";

function Chat({ setVisibility }) {
  const [open, setOpen] = useState(false);
  const [mesgInput, setMesagInput] = useState("");
  const [chat, setChat] = useState();
  const [disablesendbtn, setDisableSendBtn] = useState(false);
  const [image, setImage] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore(); //one using chatApp
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore(); //this is the one in Chatbox(who currentUser is chatting with)

  const latestMesg = useRef(null);

  // scroll to latest message in chatBox
  useEffect(() => {
    latestMesg.current?.scrollIntoView();
  });

  //fetching chats of currentUser with chatId
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setMesagInput((prev) => prev + e.emoji);
    setOpen(false);
  };

  function handleImageMessage(e) {
    if (e.target.files[0]) {
      setImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
      console.log(image.file);
    }
    // setDisableSendBtn(true);
  }

  useEffect(() => {
    console.log(image.file);
    if (!image.file) return; // Prevent sending when no image is selected

    const timeoutId = setTimeout(() => {
      console.log("3s completed, sending image:", image.file);
      handleSendMessage();
    }, 3000);

    return () => clearTimeout(timeoutId); // Cleanup timeout if component unmounts
  }, [image.file]);

  //Sendmesg, adding this to chats with senderId
  const handleSendMessage = async () => {
    if (mesgInput === "" && !image.file) return;

    let imageURL = null;

    try {
      if (image.file) {
        imageURL = await upload(image.file);
        console.log(imageURL);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          mesgInput,
          createdAt: new Date(),
          ...(imageURL && { image: imageURL }),
        }),
      });
      setDisableSendBtn(false);

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = mesgInput;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setImage({
        file: null,
        url: "",
      });
      setMesagInput("");
    }
  };

  const displayDetails = () => {
    /* 
    if(window.innerWidth <= 768){
    setVisibility({
    chat:false,
    chatList:false,
    details:true,
    })
    }

    else{
    setVisibility({
    chat:false,
    chatList:true,
    details:true,
    })
    }
    */
  };

  // when ever i choose and image to send in chat I think I'm not calling the sendMessage methods.
  // maybe that is why the image is not uploaded or sent as message.
  // but then id I'm not even calling the sendMessage method, how a new message is being created in database without createdAt,image,mesgInput values?

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Status</p>
          </div>
        </div>
        <div className="icons">
          <img src="/info.png" alt="" onClick={displayDetails} />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            <div className="texts">
              {message?.image && <img src={message.image} alt="" />}
              {message?.mesgInput && <p>{message.mesgInput}</p>}
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}
        {/* this below image is shown as our own message as sending image */}

        {image.url && (
          <div className="message own">
            <div className="texts">
              <img src={image.url} alt="" />
            </div>
          </div>
        )}
        <div ref={latestMesg} style={{ display: "hidden" }}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="image">
            <img src="/img.png" alt="" />
          </label>
          <input
            type="file"
            name=""
            id="image"
            style={{ display: "none" }}
            onChange={handleImageMessage}
          />
          <img src="/mic.png" alt="" />
        </div>
        <input
          type="text"
          className="messageInput"
          value={mesgInput}
          onChange={(e) => setMesagInput(e.target.value)}
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You are Blocked"
              : "Type your message here..."
          }
          disabled={isReceiverBlocked || isCurrentUserBlocked}
        />
        <div className="emoji">
          <img
            src="/emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendBtn"
          onClick={handleSendMessage}
          disabled={isReceiverBlocked || isCurrentUserBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
