import { useEffect, useState } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import useUserStore from "./lib/userStore";
import { auth } from "./lib/firebase";
import { useChatStore } from "./lib/useChatStore";

const App = () => {
  const [visiblity, setVisibility] = useState({
    chatList: true,
    chat: true,
    details: false,
  });
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    /*onAuthStateChanged fxn will return us the user.
     we can use this user details to fetch userchats and more */
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && visiblity.chat && <Chat setVisibility={setVisibility} />}
          {visiblity.details && <Detail setVisibility={setVisibility} />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
