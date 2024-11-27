import cloudinary from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();


// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: "dnxz5vlyi",
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('audioBlob') as File;
        
        if (!file) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResponse = await cloudinary.v2.uploader.upload(
            "data:audio/wav;base64," + buffer.toString('base64'),
            {
                resource_type: "video",
                folder: "audio_files",
            }
        );

        return NextResponse.json({ url: uploadResponse.secure_url });
    } catch (error) {
        console.error("Error uploading audio:", error);
        return NextResponse.json({ error: "Failed to upload audio" }, { status: 500 });
    }
}
