// Import Packages
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const colors = require('colors');
require('dotenv').config();

// Import Services
const { 
    addPasswordService, 
    updatePasswordService, 
    deletePasswordService, 
    getPasswordServiceById, 
    getAllPasswordsService, 
    generatePasswordService 
} = require('./services/passwordService');
const { 
    firebaseSignup, 
    firebaseLogin, 
    firebaseUserInfo, 
    firebaseForgotPassword, 
    firebaseChangePassword 
} = require('./services/userService');

// Cors middleware
let corsOptions = {
    origin: true
};
app.use(cors(corsOptions));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Demo route to test server.
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Password Manager." });
});

app.get("/getUserInfo", async (req, res) => {

    console.log("Auth Token in Controller: ", colors.blue(req.headers.authorization));
    
    let userInfo = await firebaseUserInfo(req.headers.authorization);
    console.log("User Info: ", colors.green(userInfo));
    
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
});

// User Sign Up API
app.post("/signup", async (req, res) => {

    console.log("Data in Signup Controller: ", colors.blue(req.body));
    
    let userSignup = await firebaseSignup(req.body);
    console.log("User Signup: ", colors.green(userSignup));

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

    console.log("Data in Login Controller: ", colors.blue(req.body));
    
    let userLogin = await firebaseLogin(req.body);
    console.log("User Login: ", colors.green(userLogin));
    
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

// User Forget password API
app.post("/forgotPassword", async (req, res) => {

    console.log("Data in forgotPassword Controller: ", colors.blue(req.body));

    let forgotPassword = await firebaseForgotPassword(req.body);
    console.log("forgotPassword: ", colors.green(forgotPassword));

    if (forgotPassword.success) {
        res
            .status(201)
            .json(forgotPassword);
    } else {
        res
            .status(400)
            .json(forgotPassword);
    }
});

// User Change password API
app.post("/changePassword", async (req, res) => {

    console.log("Data in changePassword Controller: ", colors.blue(req.body));

    let changePassword = await firebaseChangePassword(req.body);
    console.log("changePassword: ", colors.green(changePassword));

    if (changePassword.success) {
        res
            .status(201)
            .json(changePassword);
    } else {
        res
            .status(400)
            .json(changePassword);
        }
});

// Add Password API
app.post("/addPassword", async (req, res) => {

    console.log("Data in addPassword Controller: ", colors.blue(req.body));
    console.log("Auth Token in Controller: ", colors.blue(req.headers.authorization));

    let addPassword = await addPasswordService(req.body, req.headers.authorization);
    console.log("addPassword: ", colors.green(addPassword));

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

    console.log("Data in updatePassword Controller: ", colors.blue(req.params.id));
    console.log("Auth Token in Controller: ", colors.blue(req.headers.authorization));

    let updatePassword = await updatePasswordService(req.params.id, req.body, req.headers.authorization);
    console.log("updatePassword: ", colors.green(updatePassword));

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

    console.log("Data in getPassword Controller: ", colors.blue(req.params.id));
    console.log("Auth Token in Controller: ", colors.blue(req.headers.authorization));

    let getPassword = await getPasswordServiceById(req.params.id, req.headers.authorization);
    console.log("getPassword: ", colors.green(getPassword));

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

    console.log("Data in deletePassword Controller: ", colors.blue(req.params.id));
    console.log("Auth Token in Contoller: ", colors.blue(req.headers.authorization));

    let deletePassword = await deletePasswordService(req.params.id, req.headers.authorization);
    console.log("deletePassword: ", colors.green(deletePassword));

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

    console.log("Auth Token in Controller: ", req.headers.authorization);

    let getAllPasswords = await getAllPasswordsService(req.headers.authorization);
    console.log("getAllPasswords: ", colors.green(getAllPasswords));

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

    console.log("Auth Token in Controller: ", colors.blue(req.headers.authorization));

    let generatePassword = await generatePasswordService(req.headers.authorization);
    console.log("generatePassword: ", colors.green(generatePassword));

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
app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port " + (process.env.PORT || 5000));
});