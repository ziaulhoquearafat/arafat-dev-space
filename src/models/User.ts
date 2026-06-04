import { IUser } from "@/types";
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    profileImage: { type: String },
  },
  { timestamps: true },
);

export default models.User || model<IUser>("User", UserSchema);
