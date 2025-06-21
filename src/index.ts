// "@ts-ignore "this is badway to ignore error of ts incase use npm i @types/express

import express from "express"; 

import { Request, Response } from "express";
import mongoose  from "mongoose";
import jwt from "jsonwebtoken";
import { userModel } from "./db";
import *as dotenv from 'dotenv';
dotenv.config();
import * as bcrypt from 'bcrypt';
import {z} from "zod"
const app=express();
app.use(express.json());
import { dbconnect } from './db';
dbconnect();

const signUpSchema = z.object({
    username:z.string().min(3,"Username must be at least 3 characters").max(10,"Username must be at most 10 characters"),
    password:z.string().min(8,"Password must be at least 8 characters").max(20,"Password must be at most 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must include uppercase, lowercase, number, and special character"
    )

})

app.post("/api/v1/signUp", async(req: Request, res: Response): Promise<void> => {

    try {
        const {username,password} = signUpSchema.parse(req.body);
        const exitingUser =  await userModel.findOne({username});
        if(exitingUser){
             res.status(400).json({
                error:"user alredy present"
            })
        }
        const hashedpassword = await bcrypt.hash(password,10);
        const newUser = await userModel.create({
            username,
            password:hashedpassword
        })
        res.status(200).json({
            message:"User Created succesfully",
            userId:newUser._id
        })
    } catch (error) {
        res.status(400).json({
            error: "something went wrong while create user"
        })
    }

})


app.post("/api/v1/signIn", async(req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const exitingUser = await userModel.findOne({ username });
    if (!exitingUser) {
        res.status(400).json({
        error: "Please sign up first",
      });
    }

    const isMatch = await bcrypt.compare(password, exitingUser!.password);
    if (!isMatch) {
       res.status(401).json({
        error: "Invalid credentials",
      });
    }else{
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
});


app.post("api/v1/content",(req,res)=>{
    
})

app.get("api/v1/content",(req,res)=>{
    
})

app.delete("api/v1/signUp",(req,res)=>{
    
})

app.post("api/v1/brain/share",(req,res)=>{

})

app.get("api/v1/brain/:shareLink",(req,res)=>{
    
})

app.listen(process.env.PORT);
