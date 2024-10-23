"use client";

import { useChatStore } from "@/store/useChatStore";
import AvatarImage from "../assets/images/profile.webp";
import Image from "next/image";
import { Playground } from "@/components/footer";

export default function Home() {
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  return (
    <div className="bg-[#212121] flex flex-col h-[calc(100dvh-75px)]">
      <div className="p-4 flex-1 overflow-y-auto scroll-smooth">
        {messages.map((message, index) => (
          <ChatBubble key={index} message={message} />
        ))}
      </div>

      <Playground onNewMessage={addMessage} />
    </div>
  );
}

const ChatBubble = ({
  message,
}: {
  message: { type: "text" | "audio"; content: string };
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Image
        src={AvatarImage}
        alt="Avatar Image"
        className="size-12 rounded-full border-2 border-[#505050]"
      />
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
    </div>
  );
};
