// lib/db.js

import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://burhannola:nola.password@assessment.vyqxmnk.mongodb.net/"; // Ubah sesuai dengan URI MongoDB kamu

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default connectToDatabase;
