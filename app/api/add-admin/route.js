// app/api/add-admin/route.js

import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/db";
import Admin from "../../models/admin";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const password = searchParams.get("password");

    // Check if name or email is undefined
    if (!username || !password) {
      return NextResponse.json(
        { error: "username dan password harus disertakan." },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin dengan username yang sama sudah ada." },
        { status: 400 }
      );
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
