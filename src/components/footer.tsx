"use client";

import { ArrowUpIcon, AudioIcon, StopIcon } from "@/assets/icons/icons";
import { useRef, useCallback, useState } from "react";
import { useMicrophonePermission } from "@/hooks/useMicrophonePermission";
import { useAudioRecorder } from "@/hooks/useRecorderAudio";
import { AudioVisualizer } from "react-audio-visualize";

export const Playground = ({
  onNewMessage,
}: {
  onNewMessage: (message: { type: "text" | "audio"; content: string }) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const { permissionGranted, requestPermission } = useMicrophonePermission();
  const { isRecording, audioUrl, audioBlob, startRecording, stopRecording } =
    useAudioRecorder();

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
    <div className="py-4 px-5 w-full bg-[#212121] border-t border-[#505050]">
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

      {audioBlob && (
        <div className="mt-4">
          <AudioVisualizer
            blob={audioBlob}
            width={500}
            height={75}
            barWidth={1}
            gap={0}
            barColor={"#f76565"}
          />
        </div>
      )}
    </div>
  );
};
