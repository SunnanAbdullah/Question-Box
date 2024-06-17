import mongoose from "mongoose"
import { Schema } from "mongoose"

const  userSchema = new Schema(
    {
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    avatar: {
        type: String, // Image
    },
    password: {
        type: String,
        required: [true,"password is required"]
    },
},
{
    timestamps: true
}
)
