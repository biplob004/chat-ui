import React, { useEffect, useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axios from "axios";
import { Box, Button, useTheme } from "@mui/material";

interface Props {
  auth_token: string;
  activeChatId: string;
  loadMessages: (chatId: string) => void;
}

const ChatHistory = ({ auth_token, activeChatId, loadMessages }: Props) => {
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.post("/api/history_list", {
          auth_token: auth_token,
        });
        console.log(response.data.history_list);
        setChatHistory(response.data.history_list);
      } catch (error) {
        console.error("Error retrieving chat history:", error);
      }
    };

    fetchChatHistory();
  }, [auth_token, activeChatId]);

  const handleDeleteChat = async (chatId: string) => {
    try {
      await axios.post("/api/delete_chat", {
        auth_token: auth_token,
        chat_id: chatId,
      });

      setChatHistory((prevChatHistory) =>
        prevChatHistory.filter((id) => id !== chatId)
      );
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Chat history items */}
      <div className="px-2 py-1">
        {chatHistory.map((chatId) => (
          <Box
            key={chatId}
            sx={{
              color: theme.palette.text.primary,
              bgcolor:
                activeChatId == chatId
                  ? theme.palette.side_panel.active
                  : "transparent", // theme.palette.side_panel.bg
              "&:hover": { bgcolor: theme.palette.side_panel.hover },
              borderRadius: 1,
              p: 2,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <div
              className="flex items-center gap-2 flex-1"
              onClick={() => loadMessages(chatId)}
            >
              <ChatIcon fontSize="small" /> {chatId}
            </div>
            {/* Delete button */}
            {chatId === activeChatId && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chatId);
                }}
                sx={{
                  background: "transparent",
                }}
              >
                <HighlightOffIcon
                  sx={{
                    color: theme.palette.text.primary,
                    "&:hover": {
                      color: theme.palette.side_panel.del_icon_bg,
                    },
                  }}
                  fontSize="small"
                />
              </Button>
            )}
          </Box>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
