import { app } from "./app.js";
import connect_db from "./db/index.js";
import { PORT } from "./constant.js";


connect_db()
.then(()=>{
    app.listen(PORT , () =>{
        console.log(`Server Running at PORT : ${PORT}`)
    })
})
.catch((error)=>{
    console.log("Mongo DB Connection Failed !!! :",error)
});

