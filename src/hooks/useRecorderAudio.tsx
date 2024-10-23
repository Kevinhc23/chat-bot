"use client";

import { useState, useRef } from "react";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Guardar el Blob
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setAudioBlob(audioBlob);
      audioChunks.current = [];
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return { isRecording, audioUrl, audioBlob, startRecording, stopRecording };
};
