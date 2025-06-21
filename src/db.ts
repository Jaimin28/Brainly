import mongoose from "mongoose"; 
import { model,Schema } from "mongoose";
import { parseJsonSourceFileConfigFileContent } from "typescript";
import *as dotenv from 'dotenv';
dotenv.config();

// database connection
export const dbconnect=()=>{
    mongoose.connect(process.env.DATABASE_URL as string).then(
        ()=>{
            console.log("Database Connection Success");
            
        }
    ).catch((error)=>{
        console.log("Db connection error");
        console.log(error);
        process.exit(1);        
        
    })
}


// user schema 
const userSchema = new Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true,unique:true},
    token: {
    type: String // ✅ Add this field
  }
})

export const userModel =  model("User",userSchema);