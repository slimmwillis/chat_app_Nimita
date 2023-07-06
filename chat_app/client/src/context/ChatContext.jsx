import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, User }) => {
  const [userChats, setUserChat] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [userChatError, setUserChatError] = useState(null);
  const [potentialChats, setPotentialsChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [User]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", User?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //send message
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members?.find((id) => id !== User?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  useEffect(() => {
  console.log("notification of chat: ", notifications)    
  

  }, [notifications])
  

  //receive Message and notification
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("error fetching", response);
      }

      const pChat = response.filter((U) => {
        let isChatCreated = false;

        if (User?._id === U._id) return;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === U._id || chat.members[1] === U._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialsChats(pChat);
      setAllUsers(response);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (User?._id) {
        setIsChatLoading(true);
        setUserChatError(null);
        const response = await getRequest(`${baseUrl}/chats/${User?._id}`);
        setIsChatLoading(false);
        if (response.error) {
          return setUserChatError(response);
        }

        setUserChat(response);
      }
    };

    getUserChats();
  }, [User, notifications]);

  useEffect(() => {
    const getMessage = async () => {
      if (User?._id) {
        setIsMessageLoading(true);
        setMessageError(null);
        const response = await getRequest(
          `${baseUrl}/messages/${currentChat?._id}`
        );
        setIsMessageLoading(false);
        if (response.error) {
          return setMessageError(response);
        }
        setMessages(response);
      }
    };
    getMessage();
  }, [currentChat]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChat((prev) => [...prev, response]);
  }, []);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must type something.");
      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (response.error) return setSendTextMessageError(response);
      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    }
  );

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications?.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      //find chat to open
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });

      //mark Notification as read
      const mNotifications = notifications?.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });
      updateCurrentChat(desiredChat);
      setNotifications(mNotifications);
    },
    []
  );

  const markThisUserNotificationAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      const mNotifications = notifications?.map((el) => {
        let notification;
        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });
        return notification;
      });
      setNotifications(mNotifications);
    },
    []
  );
  return (
    <ChatContext.Provider
      value={{
        userChats,
        isChatLoading,
        userChatError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        messageError,
        isMessageLoading,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
