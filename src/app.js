import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { render } from "ejs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the "views" directory
// app.use(express.static(path.join(__dirname, 'views')));

app.use(express.static('views'))
app.use(express.static('views/components/LoginForm'))
app.use(express.static('views/components/SignupForm'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json({limit:"16kb"}));
// app.use(express.urlencoded({
//     extended:true,
//     limit:"16kb"
// }));


// app.use(express.static("public"));
// app.use(cookieParser());

app.set('views engine', 'ejs');

app.get('/', async(req,res)=>{
    res.render("index.ejs")
})

app.get('/login', async(req,res)=>{
    res.render("components/LoginForm/index.ejs")
})

app.get('/signup', async(req,res)=>{
    res.render("components/SignupForm/index.ejs")
})




export { app };