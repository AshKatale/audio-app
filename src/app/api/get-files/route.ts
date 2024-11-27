import { connect } from "@/app/db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Audiopost from "@/app/models/textModel";

connect();

export async function GET(req: NextRequest) {
    try {
        const files = await Audiopost.find();
        return NextResponse.json({ status: 200, files: files });
    } catch (error) {
        return NextResponse.json({ status: 500, error: error });
    }
}