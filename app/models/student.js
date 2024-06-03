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
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
