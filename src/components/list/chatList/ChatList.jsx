import React, { useState } from 'react';
import AddUser from './addUser/AddUser';
import "./chatList.css"

function ChatList() {
  const [addMode,setAddMode] = useState(false);
  return (
    <div className='chatList'>
      <div className="searchContainer">
        <div className="searchBar">
          <img src="../public/search.png" alt="" />
          <input type="text" name="User" id=""  placeholder='Search'/>
        </div>
        <img src={ addMode ? "/minus.png" : "./plus.png"} alt="" className='add' onClick={ ()=>setAddMode((prev) => !prev)}/>
      </div>
      <div className="item">
        <img src="/avatar.png" alt="" />
        <div className="text">
          <span>Amit</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src="/avatar.png" alt="" />
        <div className="text">
          <span>Amit</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src="/avatar.png" alt="" />
        <div className="text">
          <span>Amit</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src="/avatar.png" alt="" />
        <div className="text">
          <span>Amit</span>
          <p>Hello</p>
        </div>
      </div>
      {addMode && <AddUser/>}
    </div>
  )
}

export default ChatList