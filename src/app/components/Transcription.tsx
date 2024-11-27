import { useState } from "react";
import { Button } from "./Button";
import { TextGenerateEffect } from "./TextGenerationEffect";
import Loader from "./Loader";
import axios from "axios";
import dotenv from "dotenv";
import { Toaster, toast } from 'react-hot-toast';

dotenv.config();

interface TranscriptProps {
  audioBlob: Blob;
}

const Transcription = ({ audioBlob }: TranscriptProps) => {
  const [transcription, setTranscription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const transcribeAudio = async () => {
    let audioURL;
    setLoading(true);
    if (audioBlob) {
      try {
        const formData = new FormData();
        formData.append("audioBlob", audioBlob);

        const response = await fetch("/api/upload-audio", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          // console.log("Uploaded Audio URL:", data.url);
          setAudioUrl(data.url);
          audioURL = data.url;
          toast.success("Audio Transcribed successfully!");
        } else {
          const errorData = await response.json();
          console.error("Failed to upload audio:", errorData.error);
          toast.error("Failed to upload audio.");
        }
      } catch (error) {
        console.error("Error during upload:", error);
        toast.error("An error occurred while uploading.");
      }
    }

    // const apiKey = process.env.DEEPGRAM_API_KEY;
    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: audioURL,
        }),
      });

      const data = await response.json();
      // console.log("Transcription:", data);
      setTranscription(data.results.channels[0].alternatives[0].transcript);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to transcribe audio");
    } finally {
      setLoading(false);
    }
  };

  const saveAudioPost = async () => {
    const audioPost = {
      text: transcription,
      audioUrl: audioUrl,
      date: Date.now(),
    };

    return await axios.post("/api/save", audioPost);
  };

  return (
    <div>
      <Toaster toastOptions={
        {duration : 2000} 
      } />
      <div className="flex justify-center mx-4 gap-2">
        <Button onClick={() => transcribeAudio()} className="btn mt-4">
          Transcribe
        </Button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-lg border-2 p-5 border-black justify-center flex text-white">
          {error && <p>{error}</p>}

          <TextGenerateEffect
            className="text-white h-[350px] w-[80%] border-white border-2 rounded-2xl bg-black p-4"
            duration={2}
            filter={false}
            words={transcription}
          />
        </div>
      )}
      <div className="flex justify-center">
<Button onClick={() => 
  toast.promise(
    saveAudioPost(),
    {
      loading: 'Saving...',
      success: <b>Audio saved successfully!</b>,
      error: <b>Could not save.</b>,
    }
  )
} className="">Save</Button>
      </div>
    </div>
  );
};

export default Transcription;
