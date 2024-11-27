import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@deepgram/sdk';
import dotenv from "dotenv";

dotenv.config();

export async function POST(req: NextRequest) {
  try {
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY!;
    const { url } = await req.json();
    const deepgram = createClient(deepgramApiKey);
  
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url },
      {
        model: 'nova-2',
        language: 'en',
        smart_format: true,
      },
    );
if(error){
  return NextResponse.json({error : error , status : 500})
}
    return NextResponse.json(result, {status: 200});
  } catch (error: unknown) {
    if(error instanceof Error)
    console.error("Error with Deepgram API:", error.message);
  else
    console.error("Error with Deepgram API:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
