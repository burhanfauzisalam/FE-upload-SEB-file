// app/api/users/route.js

import connectToDatabase from "../../lib/db";
// import User from "../../../models/User";

export async function GET(request) {
  try {
    await connectToDatabase();
    // const users = await User.find();
    const users = { name: "abc" };
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
