const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config.js');

const app = express();
const port = 3000;



app.use(express.json());     // to support JSON-encoded  bodies



//Static files
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.use(express.urlencoded({ extended: false })); 
// app.set('view engine', 'html');



//views
app.get('', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/views/signup.html');
});
app.get('/ngo', (req, res) => {
    console.log(req.body)
    res.sendFile(__dirname + '/views/ngo.html');
});
app.get('/payment', (req, res) => {
    console.log(req.body)
    res.sendFile(__dirname + '/views/payment.html');
});




//Signup
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        //Hashing the password
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.send('User created successfully!');
    }
});

// Login user 
app.post("/login", async (req, res) => {
    try 
    {
        
        const check = await collection.findOne({ name: req.body.name });
        if (!check) {
            res.send("User not found!!");
        }
        // Compare the hashed password   from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            console.log('Logged in successfully!');
            // res.render("/ngo",{text:'WELCOME USER!'});
            res.redirect('/ngo');
        }
        else {
            res.send("Wrong Password"); 
            // console.log('Wrong Password');
        }
    }
    catch(err) {
        console.log('Wrong details',err);
        // res.send("wrong Details");
    }
});



//Listening on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});