import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/db";
import User from "../../models/user";
import Teacher from "../../models/teacher";
import Student from "../../models/student";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { username, password } = await request.json();
    const existingUser = await User.findOne({
      username,
      password,
    });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found." }, { status: 400 });
    }
    const userRole = existingUser.role;
    if (userRole === "teacher") {
      const userTeacher = await Teacher.findOne({ username, password });
      return NextResponse.json(userTeacher, { status: 200 });
    }
    if (userRole === "student") {
      const userStudent = await Student.findOne({ username, password });
      return NextResponse.json(userStudent, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
