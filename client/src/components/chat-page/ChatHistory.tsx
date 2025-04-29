import React, { useEffect, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from 'axios';
import { Box, Button, useTheme } from '@mui/material';

import instance from '../../config/instance'

interface Props {
  auth_token: string;
  activeChatId: string;
  loadMessages: (chatId: string) => void;
}

const ChatHistory = ({ auth_token, activeChatId, loadMessages }: Props) => {
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string; chat_id: string }[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await instance.get(`/api/chat/history`);
        const res = response.data.data;
        
        res.forEach((chat: any) => {
          chat.chat_id = chat.content.substring(0, 6) + chat.role;
        }
        );

        setChatHistory(response.data.data);
      } catch (error) {
        console.error('Error retrieving chat history:', error);
      }
    };

    fetchChatHistory();
  }, [auth_token, activeChatId]);

  const handleDeleteChat = async (chatId: string) => {
    try {
      await axios.post('/api/delete_chat', {
        auth_token: auth_token,
        chat_id: chatId,
      });

      setChatHistory((prevChatHistory) =>
        prevChatHistory.filter((chat) => chat.chat_id !== chatId)
      );
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className='flex-1 overflow-y-auto'>
      {/* Chat history items */}
      <div className='px-2 py-1'>
      {chatHistory.map((chat) => (
  <Box
    key={chat.chat_id}
    sx={{
      color: theme.palette.text.primary,
      bgcolor:
        activeChatId == chat.chat_id
          ? theme.palette.side_panel.active
          : 'transparent',
      '&:hover': { bgcolor: theme.palette.side_panel.hover },
      borderRadius: 1,
      p: 2,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
    }}
  >
    <div
      className='flex items-center gap-2 flex-1'
      onClick={() => loadMessages(chat.chat_id)}
    >
      <ChatIcon fontSize='small' /> {chat.content} {/* or chat.chat_id */}
    </div>
    {chat.chat_id === activeChatId && (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteChat(chat.chat_id);
        }}
        sx={{
          background: 'transparent',
        }}
      >
        <HighlightOffIcon
          sx={{
            color: theme.palette.text.primary,
            '&:hover': {
              color: theme.palette.side_panel.del_icon_bg,
            },
          }}
          fontSize='small'
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
