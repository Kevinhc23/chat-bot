import { useState } from "react";

export const useMicrophonePermission = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      return stream;
    } catch (err) {
      console.error("Error al solicitar permiso al micrófono:", err);
      setPermissionGranted(false);
      return null;
    }
  };

  return { permissionGranted, requestPermission };
};
