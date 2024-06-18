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
    role:{
        type:Boolean, // True for Creator and False for Attendee
        required: true
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

export const User = mongoose.model("User",userSchema);