// "@ts-ignore "this is badway to ignore error of ts incase use npm i @types/express

import express from "express";
import { userMiddleware } from "./middleware";

import { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { contentModedl, linkModel, userModel } from "./db";
import * as dotenv from "dotenv";
dotenv.config();
import * as bcrypt from "bcrypt";
import { z } from "zod";
const app = express();
app.use(express.json());
import { dbconnect } from "./db";
import { random } from "./utlis";
dbconnect();
import cors from "cors"
app.use(cors());
const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(10, "Username must be at most 10 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

app.post(
  "/api/v1/signUp",
  async (req: Request, res: Response): Promise<void> => {
    try {
      
      const { username, password } = signUpSchema.parse(req.body);
      
      const exitingUser = await userModel.findOne({ username });
      
      if (exitingUser) {
        res.status(400).json({
          error: "user alredy present",
        });
        return;
      }
      const hashedpassword = await bcrypt.hash(password, 10);
       
      const newUser = await userModel.create({
        username,
        password: hashedpassword,
      });
      
      res.status(200).json({
        message: "User Created succesfully",
        userId: newUser._id,
      });
    } catch (error) {
      res.status(400).json({
        error: "something went wrong while create user",
      });
    }
  }
);

app.post(
  "/api/v1/signIn",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      const exitingUser = await userModel.findOne({ username });
      if (!exitingUser) {
        res.status(400).json({
          error: "Please sign up first",
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, exitingUser!.password);
      if (!isMatch) {
        res.status(401).json({
          error: "Invalid credentials",
        });
        return;
      } else {
        const payload = {
          username: exitingUser!.username,
          id: exitingUser!._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "2h",
        });
        exitingUser!.token = token;
        await exitingUser!.save();

        const { password: _, ...userWithoutPassword } = exitingUser!.toObject();

        res.status(200).json({
          message: "Login successfully",
          token,
          user: userWithoutPassword,
        });
      }
    } catch (error) {
      res.status(500).json({
        error: "Internal server error during login",
      });
    }
  }
);

app.post(
  "/api/v1/content",
  userMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { link, title } = req.body;

      // Ensure userId is attached by middleware
      const userId = (req as any).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized: userId missing" });
        return;
      }

      await contentModedl.create({
        link,
        title,
        userid: userId,
        tags: [],
      });

      res.status(200).json({
        message: "Content added successfully",
      });
    } catch (error) {
      console.error("Error adding content:", error);
      res.status(500).json({
        error: "Internal server error while adding content",
      });
    }
  }
);

app.get(
  "/api/v1/getcontent",
  userMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId; // or use a custom interface for req with userId
      const content = await contentModedl
        .find({ userid: userId })
        .populate("userid", "username");

      res.json({ content });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

app.delete(
  "/api/v1/deletecontent",
  userMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {contentId} = req.body;
      if (!contentId) {
        res.status(400).json({ message: "contentId is required" });
        return;
      }
      const userId = (req as any).userId;
      const result = await contentModedl.deleteOne({
        _id: contentId,
        userid: userId,
      });
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "No content found or not authorized" });
        return;
      }
      res.status(200).json({
        message: "Content deleted successfully",
      });
    } catch (error) {
      console.error("Delete content error:", error); // log to console (backend)
      res.status(400).json({
        message: "Error occurred during delete content",
        error: error instanceof Error ? error.message : String(error), // fix here
      });
    }
  }
);

app.post("/api/v1/brain/share",userMiddleware, async(req:Request, res:Response):Promise<void> => {
  try {
    const {share} = req.body;
    const hash = random(10);
     const existinglink = await linkModel.findOne({
      userid:(req as any).userid
    })
    if(existinglink){
      res.json({
        hash:existinglink.hash
      })
      return ;
    }
  if(share){
    await linkModel.create({
        userid:(req as any).userId,
        hash:hash
    })
    res.json({
      message:"/share/" +hash
    })
  }else{
    await linkModel.deleteOne({
      userid:(req as any).userId
    });

    res.json({
      message:"Removed Link"
    })
  }
  
  } catch (error) {
    res.status(400).json({
      message:"Error occured while generating Shareble link",
      error
    })
    
  }
});

app.get("/api/v1/brain/:shareLink", async(req:Request, res:Response) : Promise<void> => {  
  try {
    const hash = req.params.shareLink;
    const link = await linkModel.findOne({hash});
    console.log(link);
    

    if(!link){
      res.status(411).json({
        message:"sorry,link is not available"
      })
    }

    const content = await contentModedl.find({userid:link?.userid});
    const user = await userModel.findOne({_id:link?.userid});

    if(!user){
      res.status(411).json({
        message:"user not found"
      })
    }

    res.status(200).json({
      username:user?.username,
      content:content
    })

  } catch (error) {
    console.log("error in while fetching content from link",error);
    res.status(500).json({message:"internal server error"});
  }

});

app.listen(process.env.PORT);
