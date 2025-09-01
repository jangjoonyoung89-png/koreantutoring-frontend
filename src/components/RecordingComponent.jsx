import React, { useRef, useState } from 'react';

export default function RecordingComponent() {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = event => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      setVideoURL(URL.createObjectURL(blob));
      recordedChunks.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  // 녹화 종료
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div>
      {!recording && <button onClick={startRecording}>녹화 시작</button>}
      {recording && <button onClick={stopRecording}>녹화 중지</button>}
      {videoURL && <video src={videoURL} controls />}
    </div>
  );
}