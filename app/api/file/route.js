import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/db";
import File from "../../models/file";

export async function GET(request) {
  try {
    await connectToDatabase();
    const file = await File.find();
    return NextResponse.json(file, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
