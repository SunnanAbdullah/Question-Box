import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { name, render } from "ejs";
import { User }  from "./schemas/user.model.js";
import { QuestionSet } from "./schemas/questionSet.model.js";
import { Questions } from "./schemas/questions.model.js";
import expressSession from 'express-session';
import _ from 'lodash';


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
    if (user.role === true ){
      const Userid = user.id
      req.session.uid = Userid
      // const q = await new QuestionSet({owner_id:Userid,QuestionSetName:"Good"})
      // await q.save()
      return res.redirect(`${Userid}/set?product=${encodeURIComponent(Userid)}`)
    }else{
      const Userid = user.id
      req.session.uid = Userid
      // const q = await new QuestionSet({owner_id:Userid,QuestionSetName:"Good"})
      // await q.save()
      return res.redirect(`${Userid}/attendee?product=${encodeURIComponent(Userid)}`)
    }
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
                const Userid = CreateUser.id
                return res.redirect(`${Userid}/attendee?product=${encodeURIComponent(Userid)}`)
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
    const o_id = req.query.product;
    const questionSet = await QuestionSet.find({ owner_id: req.query.product });
    const data  = { questionSet,o_id}
    // console.log(questionSet)
    return res.render('components/CreatorQuestionSets/index.ejs',{data})
})

app.post('/set', async (req,res) => {
    console.log("Set DAta............",req.body.Set)
})

app.post('/createquestion', async(req,res) => {
    try {
        const Userid = req.query?.owner_id
        const newQuestionSet = await new QuestionSet({owner_id:req.query?.owner_id,QuestionSetName:"Default Quiz"}) 
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
app.get('/question', async (req, res) => {
    req.session.uid = req.session.uid
    const owner_id = req.query.owner_id 
    const set_id = req.query.Set_id 
    // console.log("question - get - owner:",owner_id)
    // console.log("question - get - Set_id:",set_id)
    // console.log("question - get - session:",req.session.uid)
    const d = await QuestionSet.findById(set_id);
    const QuestionSetName = d.QuestionSetName;
    const questions = await Questions.find({set_id:set_id});
    // console.log("quessssssssssssssssstions:",questions)
    const data1 = {owner_id,set_id, QuestionSetName,questions}
    return res.render("components/Questions/index.ejs",{data1})
});


app.post('/question', async(req, res) => {
    // console.log("question - post - session:",req.session.uid)
    // console.log('Received data:', req.body);
    // const Question = new Questions({Question})

    const setname = req.query?.setname
    const set_id = req.query.set_id
    const owner_id = req.query.owner_id

    console.log("seeeeeet",set_id)
    console.log("owneeeeeeeeeeeer",owner_id)
    const questions = req.body;



    (async () => {
      try {
        const existingSetName = await QuestionSet.findById(set_id);
        if (existingSetName) {
          if (existingSetName.QuestionSetName !== setname) {
            existingSetName.QuestionSetName = setname;
            await existingSetName.save();
            console.log(`Set name updated to "${setname}"`);
          } else {
            console.log('Set name is already up-to-date.');
          }
        }

        const existingQuestionID = await existingSetName.ChildQuestionID
        console.log(existingQuestionID[0])
        let counter = -1

        for (const questionData of questions) {
          counter++
          // Find the existing question by set_id and Question text
          const existingQuestion = await Questions.findById(
            existingQuestionID[counter]
          );
          console.log(existingQuestion) 
          if (existingQuestion) {
            // Check if the question text or options have changed
            const hasChanges = (
              existingQuestion.Question != questionData.question ||
              !arraysEqual(existingQuestion.options, questionData.options)
            );
            console.log("New Question type: ",typeof questionData.question)
            console.log("Existing Question type: ",typeof existingQuestion.Question)
            console.log("New Question: ", questionData.question)
            console.log("Existing Question: ",existingQuestion.Question)
            console.log("New OPtion: ",questionData.options)
            console.log("Existing OPtion: ",existingQuestion.options)
            console.log("Question Change",(existingQuestion.Question !== questionData.question))
            console.log("Option Change",(!arraysEqual(existingQuestion.options, questionData.options)))
            console.log(hasChanges)
            if (hasChanges) {
              // Update the existing question
              existingQuestion.Question = questionData.question;
              existingQuestion.options = questionData.options;
              await existingQuestion.save();
              console.log(`Question "${questionData.question}" updated successfully!`);
            } else {
              console.log(`Question "${questionData.question}" is already up-to-date.`);
            }
          } 
          else {
            // Create a new question if it doesn't exist
            const newQuestion = new Questions({
              Question: questionData.question,
              options: questionData.options,
              set_id: questionData.set_id,
            });
            
            const existingSet = await QuestionSet.findById(set_id);
            existingSet.ChildQuestionID.push(newQuestion._id);
            await existingSet.save()
            await newQuestion.save();
            console.log(`Question "${questionData.question}" saved successfully!`);
          }
        }
      } catch (error) {
        console.error('Error saving questions:', error);
      }
    })();
    
    // Helper function to compare two arrays for equality
    function arraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
    }
    
    


    // Process the data or store it in the database as needed
    return res.redirect(`/question?owner_id=${owner_id}&Set_id=${set_id}`)
    return res.json({ message: 'Data received successfully', data: req.body });
});

app.use(express.static('views/components/AttendeeDashboard'))
app.get('/:id/attendee', async (req,res) => {
  console.log("Attendee body:",req.query.product)
  console.log("Attendee session:",req.session.uid)
  req.session.uid = req.session.uid 
  const uid = {id:req.session.uid}
  const o_id = req.query.product;
  const questionSet = await QuestionSet.find();
  const data  = {questionSet,o_id}
  // console.log(questionSet)
  return res.render('components/AttendeeDashboard/index.ejs',{data})
})

app.get('/questionattempt', async (req,res) => {
  req.session.uid = req.session.uid
  const owner_id = req.query.owner_id 
  const set_id = req.query.Set_id 
  // console.log("question - get - owner:",owner_id)
  // console.log("question - get - Set_id:",set_id)
  // console.log("question - get - session:",req.session.uid)
  const d = await QuestionSet.findById(set_id);
  const QuestionSetName = d.QuestionSetName;
  const user = await User.findById(d.owner_id);
  const CreatorName = user?.username.toUpperCase()
  const questions = await Questions.find({set_id:set_id});
  // console.log("quessssssssssssssssstions:",questions)
  const data1 = {owner_id,set_id, QuestionSetName,questions,CreatorName}
  return res.render("components/QuestionAttempt/index.ejs",{data1})
})

app.post('/submit-quiz', (req, res) => {
  const submittedAnswers = req.body;
  console.log(submittedAnswers);

  // Process the answers as needed
  // For example, you could check the answers against correct answers and calculate a score

  res.send({message:'Quiz submitted successfully!'});
});



export { app };