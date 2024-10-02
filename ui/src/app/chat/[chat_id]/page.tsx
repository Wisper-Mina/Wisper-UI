import { ChatScreen } from "@/components/pages/Chat/ChatScreen";

const ChatPage = ({
  params,
}: {
  params: {
    chat_id: string;
  };
}) => {
  return <ChatScreen chat_id={params?.chat_id} />;
};

export default ChatPage;
