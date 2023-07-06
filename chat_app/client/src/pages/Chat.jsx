import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/Chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/Chat/PotentialChats";
import ChatBox from "../components/Chat/ChatBox";

const Chat = () => {

    const { user } = useContext(AuthContext);
    const { userChats, isChatLoading, updateCurrentChat } = useContext(ChatContext);

    console.log("userChats",userChats)

    return (
        <>
            <Container style={{color:"white"}}> 
                <PotentialChats />
                {userChats?.length < 1 ? null : (
                    <Stack direction="horizontal" gap={4} className="align-items-start">
                        <Stack className="message-box flex-grow-0 pe-3" gap={3}>
                            {isChatLoading && <p>Loading Chats...</p>}
                            {userChats?.map((chat, index) => {
                                return(
                                    <div key={index} onClick={() => updateCurrentChat(chat)}>
                                        <UserChat chat={chat} user={user}/>
                                    </div>
                                )
                            })}
                        </Stack>
                        <ChatBox />
                    </Stack>
                )}
            </Container>
        </>
    )
}

export default Chat;
