import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/db";
import User from "../../models/user";
import Teacher from "../../models/teacher";
import Student from "../../models/student";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, username, password, role } = await request.json();
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exist." },
        { status: 400 }
      );
    }
    const newUser = new User({ name, username, password, role });
    await newUser.save();

    if (role === "teacher") {
      const newTeacher = new Teacher({
        userID: newUser._id,
        name,
        username,
        password,
        role,
      });
      await newTeacher.save();
      return NextResponse.json(newTeacher, { status: 201 });
    }
    if (role === "student") {
      const newTeacher = new Student({
        userID: newUser._id,
        name,
        username,
        password,
        role,
      });
      await newTeacher.save();
      return NextResponse.json(newTeacher, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
