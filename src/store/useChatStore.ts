import { create } from "zustand";

type MessageType = { type: "text" | "audio"; content: string };

interface ChatStore {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));
