import { useRouter } from "next/navigation";
import { Button } from "./Button";

export default function Hero() {

  const router = useRouter();

  return (
    <div className="items-center p-5 mt-10">
        <h1 className="text-center text-3xl font-medium">Audio Transcription App by Ashitosh</h1>
        <div className="flex justify-center">
        <Button className="btn mt-4" onClick={()=>router.push("/saved")}>Show Saved Files</Button>
        </div>
        
    </div>
  )
}
