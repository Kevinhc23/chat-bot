"use client";

import { Playground } from "@/components/footer"; // Asegúrate de que esté correctamente importado
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ type: "text" | "audio"; content: string }>
  >([]);

  // Función para agregar un nuevo mensaje al chat
  const handleNewMessage = (message: {
    type: "text" | "audio";
    content: string;
  }) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <>
      <div className="h-dvh bg-[#212121] flex flex-col justify-between">
        <div className="p-4 flex-1 overflow-y-auto">
          {messages.map((message, index) => (
            <ChatBubble key={index} message={message} />
          ))}
        </div>

        <Playground onNewMessage={handleNewMessage} />
      </div>
    </>
  );
}

const ChatBubble = ({
  message,
}: {
  message: { type: "text" | "audio"; content: string };
}) => {
  return (
    <div
      className={`my-2 p-3 max-w-xs rounded-lg ${
        message.type === "text"
          ? "bg-[#505050] text-white"
          : "bg-[#303030] text-white"
      }`}
    >
      {message.type === "text" ? (
        <p>{message.content}</p>
      ) : (
        <audio controls>
          <source src={message.content} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};
