"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentModedl = exports.userModel = exports.dbconnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// database connection
const dbconnect = () => {
    mongoose_1.default.connect(process.env.DATABASE_URL).then(() => {
        console.log("Database Connection Success");
    }).catch((error) => {
        console.log("Db connection error");
        console.log(error);
        process.exit(1);
    });
};
exports.dbconnect = dbconnect;
// user schema 
const userSchema = new mongoose_2.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, unique: true },
    token: {
        type: String // ✅ Add this field
    }
});
exports.userModel = (0, mongoose_2.model)("User", userSchema);
// content Schema
const contentSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    tag: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Tag' }],
    userid: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }
});
exports.contentModedl = (0, mongoose_2.model)("Content", contentSchema);
// tag schema
const tagSchema = new mongoose_2.Schema({});
