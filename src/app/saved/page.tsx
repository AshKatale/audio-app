"use client";

import axios from "axios";
import { useState, useEffect } from "react";

interface AudioFile {
  _id: string;
  text: string;
  date: string; 
  audioUrl: string;
}

export default function Page() {
  const [files, setFiles] = useState<AudioFile[]>([]);

  const getFiles = async () => {
    try {
      const response = await axios.get("/api/get-files"); 
      const fileData: AudioFile[] = response.data.files; 
      setFiles(fileData); 
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div className="p-4">
      {files.length > 0 ? (
        files.map((file) => (
          <div key={file._id} className="file-card mb-4 p-3 border rounded shadow">
            <h3 className="font-bold text-lg">{file.text}</h3>
            <p className="text-sm text-white">
              Date: {new Date(file.date).toLocaleDateString()}{" "}
              {new Date(file.date).toLocaleTimeString()}
            </p>
            <audio controls src={file.audioUrl} className="mt-2"></audio>
          </div>
        ))
      ) : (
        <p>No files found</p>
      )}
    </div>
  );
}