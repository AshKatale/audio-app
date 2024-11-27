"use client"

import Hero from "@/app/components/Hero";
import Image from "next/image";
import MicroPhone from "@/app/components/MicroPhone";
import { useState } from "react";
import Transcription from "@/app/components/Transcription";
import { GridBackgroundDemo } from "@/app/components/GridBackground";

export default function Home() {

  const [audioBlob, setAudioBlob] = useState<Blob |null>(null);
  const [audioURL, setAudioURL] = useState("");

  const handleNewRecording = () => {
    setAudioBlob(null);
  };

  return (
    <div className="">
          <div className="h-[40rem] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.1] bg-grid-black/[0.1]">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>
      <Hero />
      <MicroPhone onStopRecording={(blob: Blob) => setAudioBlob(blob)} onNewRecording={handleNewRecording} onTranscribe={(url) => setAudioURL(url)}/>
      {audioBlob && <Transcription audioBlob={audioBlob}/>}
      </div>
      
    </div>
  );
}
