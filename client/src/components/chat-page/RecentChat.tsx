import React, { useEffect } from 'react';
import { useState } from 'react';
import instance from '../../config/instance';

interface Props {
  loadMessages: (chatId: string) => void;
}

export default function RecentChats({loadMessages }: Props) {
  const [chats, setChats] = useState<{ title: string; id: string }[]>([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await instance.get(`/api/chat/history`);
        setChats(response.data.data);
      } catch (error) {
        console.error('Error retrieving chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);
  // }, [auth_token, activeChatId]);

  return (
    <div className='recent-chat-wrapper w-auto py-3 overflow-y-auto'>
      <ul className='space-y-2 '>
        {chats.map((chat) => (
          <li
            onClick={() => loadMessages(chat.id)}
            key={chat.id}
            style={{ width: '100%' }}
            className='p-1 rounded hover:bg-[#8585851a] cursor-pointer'
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
