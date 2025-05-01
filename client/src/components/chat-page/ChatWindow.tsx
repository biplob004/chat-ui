import React from "react";
import { Box } from "@mui/material";
import ChatMessage from "./ChatMessage";
import { Message } from "./constants";

// import logo from "assets/png/gpt-loader.png";

interface ChatWindowProps {
  messages: Message[];
  loader?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  loader = false,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      overflow="auto"
      px={10}
      py={4}
      gap={2}
    >
      {messages.map(
        ({
          id,
          content,
          isSentByUser,
          fileUrls,
          fileNames = [],
          avatarUrl,
        }) => (
          <ChatMessage
            key={id}
            message={content}
            isSentByUser={isSentByUser}
            fileUrls={fileUrls}
            fileNames={fileNames}
            avatarUrl={avatarUrl}
          />
        )
      )}

      {/* loader */}
      {loader && (
        <img
          className="chat-ai-spinner"
          src={"assets/png/gpt-loader.png"}
          alt="Logo"
          width={24}
          height={24}
        />
      )}
    </Box>
  );
};

export default ChatWindow;
