import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  grade: {
    type: Number,
    require: true,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
