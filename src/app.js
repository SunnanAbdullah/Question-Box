import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { render } from "ejs";
import { User }  from "./schemas/user.model.js";



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
    // res.send({status:201})
})

app.get('/login', async(req,res)=>{
    res.render("components/LoginForm/index.ejs")
    // res.send({status:200})
})

app.get('/signup', async(req,res)=>{
    res.render("components/SignupForm/index.ejs")
})


app.post('/signup', async(req,res) => {
    try {
        // console.log(req.body)
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        const role = req.body.role;

        if ( username === "" || email === "" || password === "" || confirm_password === "" ){
            res.send({status: 200, message:"kat laa kush to baj"})
        }
        
  
        const UserExist = await User.find({username});

        if(UserExist){
            res.send({status:200 , message:"Username or Email Already Exist"})
        }

        if ( password !== confirm_password ){
            res.send({status: 200, message:"kat laa password sai type kar"})
        }
        else{
            if ( role === "Attendee" ){
                const CreateUser = await new User({username,email,password,role:false})
                CreateUser.save();
                res.send({status: 900, message:"sab sai ha Attendee bhai"})    
            }
            else if ( role === "Creator" ){
                const CreateUser = await new User({username,email,password,role:true})
                CreateUser.save();
                res.send({status:900 , message:"sab sai ha Creator bhai"})
            }
        }
    } catch (error) {
        console.log("Some Error:",error);
        throw res.send({status: 200, message:"kat laa kush to bajjjjjjjjj"})
    }
})



export { app };