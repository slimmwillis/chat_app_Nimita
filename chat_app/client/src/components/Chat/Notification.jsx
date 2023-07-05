import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { unreadNoticationsFunc } from "../../utils/unReadNotifications";
import moment from "moment";

function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  } = useContext(ChatContext);
  const unreadNotification = unreadNoticationsFunc(notifications);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);
    return { ...n, senderName: sender?.name };
  });
  console.log("Un ", unreadNotification);
  return (
    <div className="notifications">
      <div onClick={() => setIsOpen(!isOpen)} className="notifications-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chat-right-heart-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2ZM8 3.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z" />
        </svg>
        {unreadNotification?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotification?.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              onClick={() => markAllNotificationsAsRead(notifications)}
              className="mark-as-read"
            >
              Mark all as read
            </div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span className="modification">No notifications, yet.</span>
          ) : null}
        </div>
      ) : null}
      {modifiedNotifications &&
        modifiedNotifications?.map((n, index) => {
          return (
            <div
              className={n.isRead ? "notification" : "notification not read"}
              key={index}
              onClick={() => {
                markNotificationAsRead(n, userChats, user, notifications);
                setIsOpen(false);
              }}
            >
              <span>{`${n.senderName} send you a new message.`}</span>
              <span className="notification-time">
                {moment(n.date).calendar()}
              </span>
            </div>
          );
        })}
    </div>
  );
}

export default Notification;
