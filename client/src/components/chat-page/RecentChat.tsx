import React from "react";
import { useState } from "react";

export default function RecentChats() {
  const [chats, setChats] = useState([
    { id: 1, title: "Chat with us" },
    { id: 2, title: "New Project Ideas" },
    { id: 3, title: "Client Meeting Notes" },
  ]);

  return (
    <div className="w-auto py-4 overflow-y-auto">
      <ul className="space-y-2 ">
        {chats.map((chat) => (
          <li
            key={chat.id}
            style={{ width: "100%" }}
            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
