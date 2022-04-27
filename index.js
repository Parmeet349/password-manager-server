// Import Packages
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const colors = require('colors');

// Import Constants and env Variables
const PORT = 3000;

// Import Database Connection
const sequelize = require('./db/db');

// Import Services
const { addPasswordService, updatePasswordService, deletePasswordService, getPasswordServiceById, getAllPasswordsService, generatePasswordService } = require('./services/passwordService');
const { userInfoService, userLoginService, userSignUpService } = require('./services/userService');

// Cors middleware
let corsOptions = {
    origin: true
};
app.use(cors(corsOptions));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Testing DB
sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((error) => console.log('Unable to connect to the database: ', error));

// Database connection established and synced.
sequelize.sync();

// Demo route to test server.
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Password Manager." });
});

app.get("/getUserInfo", async (req, res) => {

    console.log("Auth Token: ", req.headers.authorization);

    try{
        let userInfo = await userInfoService(req.headers.authorization);
        
        if(userInfo.success){
            res.json({
                success: true,
                message: "User Info Fetched Successfully.",
                data: userInfo.data
            });
        }
        else{
            res.json({
                success: false,
                message: "User Info Fetched Failed."
            });
        }
    }
    catch(error){
        console.log(error);
        res.json({
            success: false,
            error: error
        });
    }
});

// User Sign Up API
app.post("/signup", async (req, res) => {
    
    console.log("Data in signup Controller: ", req.body);
    
    let userSignup = await userSignUpService(req.body);

    if (userSignup.success) {
        res
            .status(201)
            .json(userSignup);
    } else {
        res
            .status(400)
            .json(userSignup);
        }
});

// User Login API
app.post("/login", async (req, res) => {
    console.log("Data in login Controller: ", req.body);
    
    let userLogin = await userLoginService(req.body);
    
    if (userLogin.success) {
        res
            .status(201)
            .json(userLogin);
    } else {
        res
            .status(400)
            .json(userLogin);
        }
});

// Add Password API
app.post("/addPassword", async (req, res) => {
    console.log("Data in addPassword Controller: ", req.body);
    console.log("Auth Token: ", req.headers.authorization);

    let addPassword = await addPasswordService(req.body, req.headers.authorization);

    if (addPassword.success) {
        res
            .status(201)
            .json(addPassword);
    } else {
        res
            .status(400)
            .json(addPassword);
        }
});

// Update Password for specific website/app using its ID
app.put("/updatePassword/:id", async (req, res) => {

    console.log("Data in updatePassword Controller: ", req.params.id);
    console.log("Auth Token: ", req.headers.authorization);

    let updatePassword = await updatePasswordService(req.params.id, req.body, req.headers.authorization);

    if (updatePassword.success) {
        res
            .status(201)
            .json(updatePassword);
    } else {
        res
            .status(400)
            .json(updatePassword);
        }
});

// Get Password for specific website/app using its ID
app.get("/getPassword/:id", async (req, res) => {

    console.log("Data in getPassword Controller: ", req.params.id);
    console.log("Auth Token: ", req.headers.authorization);

    let getPassword = await getPasswordServiceById(req.params.id, req.headers.authorization);

    if (getPassword.success) {
        res
            .status(201)
            .json(getPassword);
    } else {
        res
            .status(400)
            .json(getPassword);
        }
});

// Delete Password for specific website/app using its ID
app.post("/deletePassword/:id", async (req, res) => {

    console.log("Data in deletePassword Controller: ", req.params.id);
    console.log("Auth Token: ", req.headers.authorization);

    let deletePassword = await deletePasswordService(req.params.id, req.headers.authorization);

    if (deletePassword.success) {
        res
            .status(201)
            .json(deletePassword);
    } else {
        res
            .status(400)
            .json(deletePassword);
        }
});

// Get All Passwords for specific user
app.get("/getAllPasswords/", async (req, res) => {

    console.log("Auth Token: ", req.headers.authorization);

    let getAllPasswords = await getAllPasswordsService(req.headers.authorization);

    if (getAllPasswords.success) {
        res
            .status(201)
            .json(getAllPasswords);
    } else {
        res
            .status(400)
            .json(getAllPasswords);
        }
});

// Generate Password API
app.post("/generatePassword", async (req, res) => {

    console.log("Auth Token: ", req.headers.authorization);

    let generatePassword = await generatePasswordService(req.headers.authorization);

    if (generatePassword.success) {
        res
            .status(201)
            .json(generatePassword);
    } else {
        res
            .status(400)
            .json(generatePassword);
        }
});

// Start Server
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});