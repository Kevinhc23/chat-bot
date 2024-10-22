"use client";

import { useMicrophonePermission } from "@/hooks/useMicrophonePermission";
import { useRef, useCallback, useState } from "react";

export const Playground = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { permissionGranted, requestPermission } = useMicrophonePermission();
  const [isTextInput, setIsTextInput] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

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
      console.log("Recording audio...");

      setAudioBlob(new Blob());
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isTextInput) {
      const text = textareaRef.current?.value;
      console.log("Text submitted: ", text);

      if (textareaRef.current) textareaRef.current.value = "";
      setIsTextInput(false);
      adjustTextareaHeight();
    } else if (audioBlob) {
      console.log("Audio submitted: ", audioBlob);
      setAudioBlob(null);
    }
  };

  return (
    <div className="py-6 px-5 w-full sticky bottom-0 bg-[#212121] border-t border-[#505050]">
      <form onSubmit={handleFormSubmit} className="relative">
        <textarea
          ref={textareaRef}
          onInput={adjustTextareaHeight}
          className={`w-full bg-[#2f2f2f] py-4 px-6 text-white focus:border-0 focus:outline-none text-xl placeholder:text-white h-auto overflow-hidden resize-none ${
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
            <AudioIcon />
          </button>
        )}
      </form>
    </div>
  );
};

export const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#212121"
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
