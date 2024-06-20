import mongoose from "mongoose"
import { Schema } from "mongoose"

const  RecordSchema = new Schema(
    {
    Question: {
        type:Array,
        required: true
    },
    allOptions:{
        type:Array,
        required: true 
    },
    submittedOptions:{
        type:Array,
        required: true 
    },
    correctOption:{
        type:Array,
        required: true
    },
    score:{
        type:Number
    },
    set_id:{
        type:String, //Decide the Question Set to identify the questions
        required: true
    },
    creator_id:{
        type:String, //Decide Who is the creator of this Question Set
        required: true
    },
    attendee_id:{
        type:String, //Decide Who attempts this Question Set
        required: true
    },

},
{
    timestamps: true
}
)

export const Record = mongoose.model("Record",RecordSchema);