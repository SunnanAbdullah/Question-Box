import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { name, render } from "ejs";
import { User }  from "./schemas/user.model.js";
import { QuestionSet } from "./schemas/questionSet.model.js";
import expressSession from 'express-session';



const app = express();

app.use(expressSession({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
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


app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Destructuring for cleaner code

  // Basic validation (check for missing fields):
  if (!email || !password) {
    return res.status(400).send({ message: 'Kali Q bag raha ha lanti.' });
  }

  try {
    // Find the user by email:
    const user = await User.findOne({ email });

    // Check if user exists:
    if (!user) {
      return res.status(401).send({ message: 'User Does not exist' });
    }

    // Compare password hashes (assuming password is hashed):
    

    if (!(user.password === password)) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    // Login successful (replace with your session management or token generation):
    console.log('User logged in successfully!'); // Placeholder for session or token
    const Userid = user.id
    req.session.uid = Userid
    // const q = await new QuestionSet({owner_id:Userid,QuestionSetName:"Good"})
    // await q.save()
    return res.redirect(`${Userid}/set?product=${encodeURIComponent(Userid)}`)
  } catch (error) {
    console.error(error); // Log the error for debugging
    throw res.status(500).send({ message: 'Internal server error.' }); // Handle unexpected errors gracefully
  }
});


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
           return res.send({status: 200, message:"kat laa kush to baj"})
        }
        
  
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        // console.log(existingUser)
        if (existingUser) {
            return res.status(409).send({ message: "Username or Email already exists." });
        }

        if ( password !== confirm_password ){
            return res.send({status: 200, message:"kat laa password sai type kar"})
        }
        else{
            if ( role === "Attendee" ){
                const CreateUser = await new User({username,email,password,role:false})
                CreateUser.save();
                return  res.send({status: 900, message:"sab sai ha Attendee bhai"})    
            }
            else if ( role === "Creator" ){
                const CreateUser = await new User({username,email,password,role:true})
                CreateUser.save();
                const Userid = CreateUser.id
                req.session.uid = Userid
                return res.redirect(`${Userid}/set?product=${encodeURIComponent(Userid)}`)
                // res.send({status:900 , message:"sab sai ha Creator bhai"})
            }
        }
    } catch (error) {
        console.log("Some Error:",error);
        throw res.send({status: 200, message:"kat laa kush to bajjjjjjjjj"})
    }
})

app.get('/:id/set', async (req,res) => {
    console.log("body:",req.query.product)
    console.log("session:",req.session.uid)
    req.session.uid = req.session.uid 
    const uid = {id:req.session.uid}
    const questionSet = await QuestionSet.find({ owner_id: req.query.product });
    // console.log(questionSet)
    return res.render('components/CreatorQuestionSets/index.ejs',{questionSet})
})

app.post('/set', async (req,res) => {
    console.log("Set DAta............",req.body.Set)
})

app.post('/createquestion', async(req,res) => {
    try {
        const Userid = req.query.owner_id
        const newQuestionSet = await new QuestionSet({owner_id:req.query.owner_id,QuestionSetName:"Default Quiz"}) 
        newQuestionSet.save()
        if(newQuestionSet){
            return res.redirect(`${Userid}/set?product=${encodeURIComponent(Userid)}`)
            // return res.status(200).send({message:`Sab sai ha chachu create mar question nu ${req.query.owner_id}`})
        }
    } catch (error) {
        throw res.send({error: error})        
    }
})

app.use(express.static('views/components/Questions'))
// userid/question/setid
app.get('/question', (req, res) => {
    req.session.uid = req.session.uid
    const owner_id = req.query.owner_id 
    const set_id = req.query.Set_id 
    const data_id = {owner_id,set_id}
    console.log("question - get - owner:",owner_id)
    console.log("question - get - Set_id:",set_id)
    console.log("question - get - session:",req.session.uid)
    return res.render("components/Questions/index.ejs",{data_id})
});


app.post('/question', (req, res) => {
    console.log("question - post - session:",req.session.uid)
    console.log('Received data:', req.body[1]);
    // Process the data or store it in the database as needed
    return res.json({ message: 'Data received successfully', data: req.body });
});



export { app };