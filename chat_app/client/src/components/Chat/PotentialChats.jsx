import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";


const PotentialChats = () => {

    const { user } = useContext(AuthContext)
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

    return (
        <> 
            <div className="all-user">
                {potentialChats&&potentialChats?.map((U, index)=>{
                    return (<div className="single-user" key={index} onClick={()=>createChat(user?._id, U?._id)}>
                        {U.name}
                        <span className={
                            onlineUsers?.some((user)=>user.userId===U?._id)?"user-online":""
                            }   />
                        </div>)
                })}
             
            </div>
        </>
    )
}

export default PotentialChats;