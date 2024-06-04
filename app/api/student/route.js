import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/db";
import Student from "../../models/student";

export async function GET(request) {
  try {
    await connectToDatabase();
    const data = await Student.find();
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
