import mongoose from "mongoose";

const userTeachersSchema = new mongoose.Schema(
  {
    id: String,
    username: String,
    access: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const userTeachers =
  mongoose.models.userTeachers ||
  mongoose.model("userTeachers", userTeachersSchema);

export default userTeachers;
