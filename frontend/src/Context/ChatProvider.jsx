import React, { createContext, useContext, useEffect, useState } from "react";
export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [onlineUsers, setOnlineUsers] = useState(new Set());

    // const Navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(user);
    setUser(user);
  //   if (!user) Navigate("/"); // can't use outside of the router that'why i am not using it
  }, []);  // if it does not find a user , go back to home page 

  // const History = useNavigate();

  // useEffect(() => {
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //   setUser(userInfo);

  //   if (!userInfo) History.push("/");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [History]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
