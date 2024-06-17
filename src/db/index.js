import mongoose from "mongoose";
import {DATABASE_NAME} from "../constant.js"

const connect_db = async () => {
   
    try {
        const ConnectionInstance = await mongoose.connect(`mongodb://localhost:27017/${DATABASE_NAME}`);
        console.log(`Successfully MongoDB Connected: ${ConnectionInstance.connection.host} `)
    } catch (error) {
        console.log(`Error At connecting MongoDB: ${error}`)
    }
    
}


export default connect_db ;