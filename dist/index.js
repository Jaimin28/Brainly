"use strict";
// "@ts-ignore "this is badway to ignore error of ts incase use npm i @types/express
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const bcrypt = __importStar(require("bcrypt"));
const zod_1 = require("zod");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const db_2 = require("./db");
(0, db_2.dbconnect)();
const signUpSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be at least 3 characters").max(10, "Username must be at most 10 characters"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters").max(20, "Password must be at most 20 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Password must include uppercase, lowercase, number, and special character")
});
app.post("/api/v1/signUp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = signUpSchema.parse(req.body);
        const exitingUser = yield db_1.userModel.findOne({ username });
        if (exitingUser) {
            res.status(400).json({
                error: "user alredy present"
            });
        }
        const hashedpassword = yield bcrypt.hash(password, 10);
        const newUser = yield db_1.userModel.create({
            username,
            password: hashedpassword
        });
        res.status(200).json({
            message: "User Created succesfully",
            userId: newUser._id
        });
    }
    catch (error) {
        res.status(400).json({
            error: "something went wrong while create user"
        });
    }
}));
app.post("/api/v1/signIn", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const exitingUser = yield db_1.userModel.findOne({ username });
        if (!exitingUser) {
            res.status(400).json({
                error: "Please sign up first",
            });
        }
        const isMatch = yield bcrypt.compare(password, exitingUser.password);
        if (!isMatch) {
            res.status(401).json({
                error: "Invalid credentials",
            });
        }
        else {
            const payload = {
                username: exitingUser.username,
                id: exitingUser._id,
            };
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            exitingUser.token = token;
            yield exitingUser.save();
            const _a = exitingUser.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
            res.status(200).json({
                message: "Login successfully",
                token,
                user: userWithoutPassword,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "Internal server error during login",
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, title } = req.body;
        // Ensure userId is attached by middleware
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: userId missing" });
            return;
        }
        yield db_1.contentModedl.create({
            link,
            title,
            userid: userId,
            tags: [],
        });
        res.status(200).json({
            message: "Content added successfully",
        });
    }
    catch (error) {
        console.error("Error adding content:", error);
        res.status(500).json({
            error: "Internal server error while adding content",
        });
    }
}));
app.get("api/v1/content", (req, res) => {
});
app.delete("api/v1/signUp", (req, res) => {
});
app.post("api/v1/brain/share", (req, res) => {
});
app.get("api/v1/brain/:shareLink", (req, res) => {
});
app.listen(process.env.PORT);
