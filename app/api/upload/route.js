// app/api/add-admin/route.js

import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/db";
import File from "../../models/file";

// export async function GET(request) {
//   try {
//     await connectToDatabase();

//     const { searchParams } = new URL(request.url);
//     const filename = searchParams.get("filename");
//     const url = searchParams.get("url");

//     // Check if name or email is undefined
//     if (!filename || !url) {
//       return NextResponse.json(
//         { error: "please input a file." },
//         { status: 400 }
//       );
//     }

//     const existingFile = await File.findOne({ filename });
//     if (existingFile) {
//       return NextResponse.json(
//         { error: "File already exist." },
//         { status: 400 }
//       );
//     }

//     const newFile = new File({ filename, url });
//     await newFile.save();

//     return NextResponse.json(newFile, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export async function POST(request) {
  try {
    await connectToDatabase();
    const { filename, url, grade, subject, assessment, teacher } =
      await request.json();
    const existingFile = await File.findOne({ filename });
    if (existingFile) {
      return NextResponse.json(
        { error: "File already exist." },
        { status: 400 }
      );
    }
    const newFile = new File({
      filename,
      url,
      grade,
      subject,
      assessment,
      teacher,
    });
    await newFile.save();
    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle DELETE request for deleting an existing file
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    // Check if filename is undefined
    if (!url) {
      return NextResponse.json(
        { error: "File must be provided." },
        { status: 400 }
      );
    }

    const fileToDelete = await File.findOne({ url });
    if (!fileToDelete) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    await File.deleteOne({ url });

    return NextResponse.json(
      { message: `File has been deleted.` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
