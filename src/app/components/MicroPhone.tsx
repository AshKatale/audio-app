"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "./Button";

interface MicroPhoneProps {
  onStopRecording: (audioBlob: Blob) => void;
  onTranscribe: (url: string) => void; 
  onNewRecording: () => void; 
}

export default function MicroPhone({
  onStopRecording,
  onNewRecording,
}: MicroPhoneProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); 
  const [timer, setTimer] = useState(0); 
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startRecording = async () => {
    const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(userStream);
    console.log(audioBlob);
    
    const mediaRecorder = new MediaRecorder(userStream);
    mediaRecorderRef.current = mediaRecorder;
    chunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioUrl(audioURL);
      setAudioBlob(audioBlob);
      onStopRecording(audioBlob);
      setTimer(0); 
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    turnOffMicrophone();
  };

  const turnOffMicrophone = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.stop();
        }
      });
    }
  };

  const handleNewRecording = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setIsRecording(false);
    setTimer(0);
    if (onNewRecording) {
      onNewRecording(); 
    }
  };

  return (
    <div className="flex flex-col items-center">
      
      {!audioUrl && <Button onClick={isRecording ? stopRecording : startRecording}>
        <div className="flex items-center gap-2">
          <span>{isRecording ? "Stop" : "Start"}</span>
          {isRecording && (
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div> 
          )}
        </div>
      </Button>}

   
      {isRecording && (
        <div className="mt-2 text-lg font-medium text-red-500">
          Recording: {formatTimer(timer)}
        </div>
      )}

      
      <div className="mx-4">
        {audioUrl ? (
          <div className="flex justify-center gap-2">
            <audio className="mt-4" controls src={audioUrl}></audio>
              <Button onClick={handleNewRecording} className="mt-6">Record Another</Button>
          </div>
        ) : (
          <p className="mt-4 text-xl">No Recordings</p>
        )}
      </div>
    </div>
  );
}
