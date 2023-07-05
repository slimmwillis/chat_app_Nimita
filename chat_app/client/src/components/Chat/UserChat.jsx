import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient"
import avatar from "../../assets/avtar.svg"
import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import { unreadNoticationsFunc } from "../../utils/unReadNotifications";
import moment from "moment";


const UserChat = ({chat, user}) => {

    const { recipientUser } = useFetchRecipientUser(chat, user);
    const {onlineUsers, notifications, markThisUserNotificationAsRead} = useContext(ChatContext)
    const {latestMessage} = useFetchLatestMessage(chat)
    const unreadNotification = unreadNoticationsFunc(notifications)
    const thisUserNotifications = unreadNotification?.filter(
        n=>n.senderId!==recipientUser?._id
    )
    const isOnline = onlineUsers?.some((user)=>user?.userId===recipientUser?._id)
    const trunketText = (text)=>{
        let shortText = text.substring(0, 20)
        if(text?.length>20){
            shortText = shortText + "..."
        }return shortText;
    }
    return( 
        <> 
            <Stack direction="horizontal" role="button" gap={3} className="user-card align-item-center p justify-content-between"
            onClick={()=>{
                if(thisUserNotifications?.length!==0){
                    markThisUserNotificationAsRead(thisUserNotifications, notifications)
                }
            }}>
               
                <div className="d=flex">
                    <div className="me-2">
                        <img src={avatar} height="35px"/>
                    </div>
                    <div className="text-content">
                        <div className="name">{recipientUser?.name}</div>
                        <div className="text">{latestMessage?.text&&(
                            <span>{trunketText(latestMessage?.text)}</span>
                        )}</div>
                    </div>
                </div>

                <div className="d-flex flex-column align-item-end">
                    <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
                    <div className={thisUserNotifications?.length>0?"this-user-notification":""}>{thisUserNotifications?.length>0?thisUserNotifications?.length:""}</div>
                    <span className={isOnline?"user-online":""}></span>
                </div>  

            </Stack>
        </>
    )
}

export default UserChat