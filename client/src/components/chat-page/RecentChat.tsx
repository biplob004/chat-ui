import React, { useEffect } from 'react';
import { useState } from 'react';
import instance from '../../config/instance';

export default function RecentChats() {
  const [chats, setChats] = useState([
    { id: 1, chatId: 'Chat with us' },
    { id: 2, chatId: 'New Project Ideas' },
    { id: 3, chatId: 'Client Meeting Notes' },
  ]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await instance.get(`/api/chat/history`);
        console.log(response.data.data);
        const res = response.data.data;
        res.forEach((chat: any) => {
          chat.chatId = chat.content.substring(0, 20);
        }
        );
        setChats(response.data.data);
      } catch (error) {
        console.error('Error retrieving chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);
  // }, [auth_token, activeChatId]);

  return (
    <div className='w-auto py-4 overflow-y-auto'>
      <ul className='space-y-2 '>
        {chats.map((chat) => (
          <li
            key={chat.id}
            style={{ width: '100%' }}
            className='p-1 rounded hover:bg-gray-100 cursor-pointer'
          >
            {chat.chatId}
          </li>
        ))}
      </ul>
    </div>
  );
}
