import mongoose from "mongoose"
import { Schema } from "mongoose"

const  QuestionsSchema = new Schema(
    {
    Question: {
        type: String,
        required: true,
        index: true
    },
    options:{
        type:Array,
        required: true 
    },
    set_id:{
        type:String, //Decide Who is the owner of this Question Set
        required: true
    },

},
{
    timestamps: true
}
)

export const Questions = mongoose.model("Questions",QuestionsSchema);