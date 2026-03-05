import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const { image } = body

    const upload = await cloudinary.uploader.upload(image, {
      folder: "china-town-products"
    })

    return NextResponse.json({
      url: upload.secure_url
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}