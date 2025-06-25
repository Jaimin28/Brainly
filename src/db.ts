import mongoose, { mongo } from "mongoose";
import { model, Schema } from "mongoose";
import { parseJsonSourceFileConfigFileContent } from "typescript";
import * as dotenv from "dotenv";
import { string } from "zod";
dotenv.config();

// database connection
export const dbconnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL as string)
    .then(() => {
      console.log("Database Connection Success");
    })
    .catch((error) => {
      console.log("Db connection error");
      console.log(error);
      process.exit(1);
    });
};

// user schema
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true, unique: true },
  token: {
    type: String, // ✅ Add this field
  },
});

export const userModel = model("User", userSchema);

// content Schema

const contentSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
export const contentModedl = model("Content", contentSchema);

// tag schema

const tagSchema = new Schema({});

// links schema
const LinkSchema = new Schema({
  hash: String,
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User",unique:true, required: true },
});
export const linkModel = model("Links", LinkSchema);


