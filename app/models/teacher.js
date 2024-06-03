import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
