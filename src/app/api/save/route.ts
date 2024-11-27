import { connect } from "@/app/db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Audiopost from "@/app/models/textModel";

connect();

export async function POST(req: NextRequest){
    try {
        const reqBody = await req.json();
        const {text, date , audioUrl} = reqBody;

        const audio = new Audiopost({
            text: text,
            date: date,
            audioUrl: audioUrl
        })

        audio.save();
        
        return NextResponse.json({status : 201 , message : "Audio saved successfully"})

    } catch (error) {
        return NextResponse.json({error : error , status : 500})
    }
}