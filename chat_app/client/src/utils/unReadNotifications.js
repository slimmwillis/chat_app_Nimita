export const unreadNoticationsFunc = (notification) => {
  return notification?.filter((n) => n.isRead === false);
};
