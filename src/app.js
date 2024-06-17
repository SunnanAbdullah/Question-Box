import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}));

app.use(express.static("public"));
app.use(cookieParser());




export { app };