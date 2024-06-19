import mongoose from "mongoose"
import { Schema } from "mongoose"

const  QuestionSetSchema = new Schema(
    {
    QuestionSetName: {
        type: String,
        required: true,
        index: true
    },
    owner_id:{
        type:String, //Decide Who is the owner of this Question Set
        required: true
    },
    coverimage: {
        type: String, // Image
    },
},
{
    timestamps: true
}
)

export const QuestionSet = mongoose.model("QuestionSet",QuestionSetSchema);