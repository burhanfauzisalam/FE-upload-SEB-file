import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/db";
import Teacher from "../../models/teacher";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, username, password } = await request.json();
    const existingTeacher = await Teacher.findOne({ username });
    if (existingTeacher) {
      return NextResponse.json(
        { message: "Teacher already exist." },
        { status: 400 }
      );
    }
    const newTeacher = new Teacher({ name, username, password });
    await newTeacher.save();
    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username) {
      return NextResponse.json(
        { message: "please input a username." },
        { status: 400 }
      );
    }
    const teacher = await Teacher.findOne({ username }).select("-password");

    if (!teacher) {
      return new Response(JSON.stringify({ error: "teacher not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ message: "teacher found", teacher }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
