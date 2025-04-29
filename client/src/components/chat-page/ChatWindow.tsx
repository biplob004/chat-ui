import React from "react";
import { Box } from "@mui/material";
import ChatMessage from "./ChatMessage";

import { Message } from "./constants";

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
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
    </Box>
  );
};

export default ChatWindow;
