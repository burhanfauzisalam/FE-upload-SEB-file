import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/db";
import Teacher from "../../models/teacher";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, username, password } = await request.json();
    const existingTeacher = await Teacher.findOne({
      username,
      password,
    });
    if (!existingTeacher) {
      return NextResponse.json(
        { message: "Teacher not found." },
        { status: 400 }
      );
    }
    return NextResponse.json(existingTeacher, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
