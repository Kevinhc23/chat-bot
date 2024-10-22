"use client";

import { useRef, useCallback, useState } from "react";
import { useMicrophonePermission } from "@/hooks/useMicrophonePermission";
import { useAudioRecorder } from "@/hooks/useRecorderAudio";

export const Playground = ({
  onNewMessage,
}: {
  onNewMessage: (message: { type: "text" | "audio"; content: string }) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { permissionGranted, requestPermission } = useMicrophonePermission();
  const [isTextInput, setIsTextInput] = useState(false);

  const { isRecording, audioUrl, startRecording, stopRecording } =
    useAudioRecorder(); // Desestructuramos las funciones y estados del hook

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;

      if (textarea.scrollHeight > 60) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    }
  }, []);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value.trim();
    setIsTextInput(value.length > 0);
  };

  const handleAudioRecording = async () => {
    if (!permissionGranted) {
      await requestPermission();
    }

    if (permissionGranted) {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        startRecording(stream);
      } else {
        stopRecording();
      }
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isTextInput) {
      const text = textareaRef.current?.value;
      if (text) {
        onNewMessage({ type: "text", content: text });
        textareaRef.current.value = "";
        setIsTextInput(false);
        adjustTextareaHeight();
      }
    } else if (audioUrl) {
      onNewMessage({ type: "audio", content: audioUrl });
    }
  };

  return (
    <div className="py-4 px-5 w-full sticky bottom-0 bg-[#212121] border-t border-[#505050]">
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

// Iconos (puedes usar los mismos que tenías antes)

export const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 5v14" />
    <path d="M18 11l-6 -6" />
    <path d="M6 11l6 -6" />
  </svg>
);

export const AudioIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-microphone"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <path d="M8 21l8 0" />
    <path d="M12 17l0 4" />
  </svg>
);

export const StopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icon-tabler-square"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);
