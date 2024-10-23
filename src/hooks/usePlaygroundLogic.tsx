"use client";

import { useRef, useCallback, useState } from "react";
import { useMicrophonePermission } from "@/hooks/useMicrophonePermission";
import { useAudioRecorder } from "@/hooks/useRecorderAudio";

export const usePlaygroundLogic = (
  onNewMessage: (message: { type: "text" | "audio"; content: string }) => void
) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const { permissionGranted, requestPermission } = useMicrophonePermission();
  const { isRecording, audioUrl, startRecording, stopRecording } =
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

  return {
    textareaRef,
    isExpanded,
    isTextInput,
    isRecording,
    handleTextareaChange,
    handleAudioRecording,
    handleFormSubmit,
    adjustTextareaHeight,
  };
};
