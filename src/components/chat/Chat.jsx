import React, { useEffect, useRef } from "react";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";

function Chat() {
  const [open, setOpen] = useState(false);
  const [mesgInput, setMesagInput] = useState("");
  const latestMesg = useRef(null);

  useEffect(()=>{
    latestMesg.current?.scrollIntoView();
  },[])

  const handleEmoji = (e) => {
    setMesagInput((prev) => prev + e.emoji);
    setOpen(false);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <span>Name Here</span>
            <p>Status</p>
          </div>
        </div>
        <div className="icons">
          <img src="/phone.png" alt="" />
          <img src="/video.png" alt="" />
          <img src="/info.png" alt="" />
        </div>
      </div>
      <div className="center">
        <div className="message">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, dignissimos suscipit! Deserunt sequi ducimus dicta
              officiis quam optio at id.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, dignissimos suscipit! Deserunt sequi ducimus dicta
              officiis quam optio at id.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, dignissimos suscipit! Deserunt sequi ducimus dicta
              officiis quam optio at id.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, dignissimos suscipit! Deserunt sequi ducimus dicta
              officiis quam optio at id.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, dignissimos suscipit! Deserunt sequi ducimus dicta
              officiis quam optio at id.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, dignissimos suscipit! Deserunt sequi ducimus dicta
              officiis quam optio at id.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div ref={latestMesg} style={{display:"hidden"}}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="/img.png" alt="" />
          <img src="/camera.png" alt="" />
          <img src="/mic.png" alt="" />
        </div>
        <input
          type="text"
          className="messageInput"
          value={mesgInput}
          onChange={(e) => setMesagInput(e.target.value)}
          placeholder="Type your message..."
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
        <button className="sendBtn">Send</button>
      </div>
    </div>
  );
}

export default Chat;
