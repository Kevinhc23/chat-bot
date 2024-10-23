"use client";

import { ArrowUpIcon, AudioIcon, StopIcon } from "@/assets/icons/icons"; // Asegúrate de tener estos íconos en la carpeta de componentes.
import { usePlaygroundLogic } from "@/hooks/usePlaygroundLogic"; // La lógica que se va a extraer

export const Playground = ({
  onNewMessage,
}: {
  onNewMessage: (message: { type: "text" | "audio"; content: string }) => void;
}) => {
  const {
    textareaRef,
    isExpanded,
    isTextInput,
    isRecording,
    handleTextareaChange,
    handleAudioRecording,
    handleFormSubmit,
    adjustTextareaHeight,
  } = usePlaygroundLogic(onNewMessage);

  return (
    <div className="py-4 px-5 w-full bg-[#212121] border-t border-[#505050] h-auto">
      <form onSubmit={handleFormSubmit} className="relative">
        <textarea
          ref={textareaRef}
          onInput={adjustTextareaHeight}
          className={`w-full bg-[#2f2f2f] py-4 pl-[20px] pr-[56px] text-white focus:border-0 focus:outline-none text-xl placeholder:text-white h-auto overflow-hidden resize-none ${
            isExpanded ? "rounded-2xl" : "rounded-full"
          }`}
          placeholder="Escribe algo"
          rows={1}
          onChange={handleTextareaChange}
        />

        {isTextInput ? (
          <button
            className="absolute right-4 bottom-4 bg-[#505050] p-2 rounded-full"
            type="submit"
          >
            <ArrowUpIcon />
          </button>
        ) : (
          <button
            className="absolute right-4 bottom-4 bg-[#505050] p-2 rounded-full"
            type="button"
            onClick={handleAudioRecording}
          >
            {isRecording ? <StopIcon /> : <AudioIcon />}
          </button>
        )}
      </form>
    </div>
  );
};
