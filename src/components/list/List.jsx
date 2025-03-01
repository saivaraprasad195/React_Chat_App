import "./list.css"
import React from 'react';
import UserInfo from './userInfo/Userinfo';
import ChatList from './chatList/ChatList';

function List() {
  return (
    <div className='list'>
      <UserInfo/>
      <ChatList />
    </div>
  )
}

export default List