// Import Packages
const colors = require('colors');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Import Firebase Database Connection
const firebase = require('../firebase/firebase_connect')

// Import Services and Utils
const { encryptPassword, decrptPassword } = require('./encryptionHandlerService');
const {issueJWT} = require('../utils/jwtHelper');
const {decodeJWT} = require('../utils/jwtHelper');

// Firebase User Signup
const firebaseSignup = async (data) => {
    try{
        const { name, email_address, password, phone_number } = data;

        // Check if phone_number already exists
        console.log("Checking Phone Number Exists");
        let checkPhoneNumber = await firebase.collection('users').where('phone_number', '==', phone_number).get();
        console.log("Phone Number Checked Successfully");

        // Check if phone_number already exists
        if(checkPhoneNumber.empty){
            // Check if email_address already exists
            console.log("Checking Email Address Exists");
            let checkEmail = await firebase.collection('users').where('email_address', '==', email_address).get();
            console.log("Phone Email Address Successfully");

            // Check if email_address already exists
            if(checkEmail.empty){
                if(name && email_address && password && phone_number){
                    // Encrypt password
                    let encryptedPassword = await encryptPassword(password);

                    // Create user in Firebase
                    let user = await firebase.collection('users').add({
                        name: name,
                        email_address: email_address,
                        password: encryptedPassword.password,
                        iv: encryptedPassword.iv,
                        phone_number: phone_number,
                    });
                    
                    return{
                        success: true,
                        message: "User created successfully.",
                        data: {
                            user_id: user.id,
                            name: name,
                            email_address: email_address,
                            phone_number: phone_number,
                        }
                    }
                }
                else{
                    return {
                        success: false,
                        message: "Please fill all the fields."
                    }
                }
            }
            else{
                return {
                    success: false,
                    message: "Email address already exists."
                }
            }
        }
        else{
            return {
                success: false,
                message: "Phone number already exists."
            }
        }
    }
    catch(error){
        console.log(error);
        return {
            success: false,
            error: error
        }
    }
}

// Firebase User Login
const firebaseLogin = async (data) => {
    try{
        const { email_address, password } = data;
        
        // Check if email_address already exists
        console.log("Checking Email Address Exists");
        let checkEmail = await firebase.collection('users').where('email_address', '==', email_address).get();
        console.log("Email Address Checked Successfully");

        // Check if email_address already exists
        if(checkEmail.empty){
            return {
                success: false,
                message: "User does not exist. Please create an account."
            }
        }
        else{
            // Get user details
            let user = checkEmail.docs[0].data();

            // Get Id or key of the user
            let id = checkEmail.docs[0].id;
            console.log("ID",colors.green(id))
            let tokenData = {
                id: id ,
                email_address: user.email_address 
            }

            let passwordData = {
                password: user.password,
                iv: user.iv
            }
            // Decrypt password
            let decryptedPassword = await decrptPassword(passwordData);
            
            // Check if password matches
            if(password === decryptedPassword.password){
                // Create JWT Token
                const token = issueJWT(tokenData);

                // Check if token is created
                if(token){
                    return {
                        success: true,
                        message: "User logged in successfully.",
                        data: {
                            email_address: user.email_address,
                            token: token
                        }
                    }
                }
                else{
                    return {
                        success: false,
                        message: "User logged in failed."
                    }
                }
            }
            else{
                return {
                    success: false,
                    message: "Password is incorrect."
                }
            }
        }
    }
    catch(error){
        console.log(error);
        return {
            success: false,
            error: error
        }
    }
}

// Firebase Forget password
const firebaseForgotPassword = async (data) => {
    try{
        const { email_address } = data;

        // Check if email_address already exists
        console.log("Checking Email Address Exists");
        let checkEmail = await firebase.collection('users').where('email_address', '==', email_address).get();
        console.log("Email Address Checked Successfully");

        // Check if email_address already exists
        if(checkEmail.empty){
            return {
                success: false,
                message: "User does not exist. Please create an account."
            }
        }
        else{
            let user = checkEmail.docs[0].data();
            let password = user.password;
            let iv = user.iv;
            let passwordData = {
                password: password,
                iv: iv
            }
            // Decrypt password
            let decryptedPassword = await decrptPassword(passwordData);
            let email = user.email_address;
            let name = user.name;
            let phone_number = user.phone_number;
            let email_address = user.email_address;
            let userId = user.id;
            let userData = {
                name: name,
                email_address: email_address,
                phone_number: phone_number,
                id: userId
            }
            let message = `Hi ${name},\n\nYour password is ${decryptedPassword.password}.\n\nThank you.`;
            let subject = "Password Reset";
            let emailData = {
                message: message,
                subject: subject,
                email: email,
                userData: userData
            }

            // Send email
            let emailSent = await sendEmail(emailData);
            if(emailSent){
                return {
                    success: true,
                    message: "Email sent successfully."
                }
            }
            else{
                return {
                    success: false,
                    message: "Email sent failed."
                }
            }
        }
    }
    catch(error){
        console.log(error);
        return {
            success: false,
            error: error
        }
    }
}

// Function to Send Email
const sendEmail = async (data) => {
    try{
        const { message, subject, email, userData } = data;

        // Create Email Template
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sparmeet54@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });
        let mailOptions = {
            from: 'sparmeet54@gmail.com',
            to: email,
            subject: subject,
            text: message
        };

        // Send Email
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent", info);
        return true;
    }
    catch(error){
        console.log(error);
        return false;
    }
}

// Firebase Pssword Reset
const firebaseChangePassword = async (data) => {
    try{
        const { email_address, password, new_password } = data;

        // Check if email_address already exists
        console.log("Checking Email Address Exists");
        let checkEmail = await firebase.collection('users').where('email_address', '==', email_address).get();
        console.log("Email Address Checked Successfully");
        
        // Check if email_address already exists
        if(checkEmail.empty){
            return {
                success: false,
                message: "User does not exist. Please create an account."
            }
        }
        else{
            let user = checkEmail.docs[0].data();
            let passwordData = {
                password: user.password,
                iv: user.iv
            }
            // Decrypt password
            let decryptedPassword = await decrptPassword(passwordData);

            // Check if password matches
            if(password === decryptedPassword.password){
                let encryptedNewPassword = await encryptPassword(new_password);

                let id = checkEmail.docs[0].id;
                console.log("", colors.green(id))

                // Update password
                let updatePassword = await firebase.collection('users').doc(id).update({
                    password: encryptedNewPassword.password,
                    iv: encryptedNewPassword.iv
                });
                console.log("Update Password", updatePassword)

                // Check if password updated
                if(updatePassword){
                    return {
                        success: true,
                        message: "Password changed successfully."
                    }
                }
                else{
                    return {
                        success: false,
                        message: "Password changed failed."
                    }
                }
            }
            else{
                return {
                    success: false,
                    message: "Password is incorrect."
                }
            }
        }
    }
    catch(error){
        console.log(error);
        return {
            success: false,
            error: error
        }
    }
}

// function to get loggedin user from firebase
const firebaseUserInfo = async (authToken) => {

    try{
        // Get user id from token
        let decodedToken = await decodeJWT(authToken);
        console.log("Decoded Token", decodedToken)
        
        // If token is valid
        if(decodedToken){
            let userId = decodedToken

            // Get user info from firebase
            console.log("Getting User Details");
            let userData = await firebase.collection('users').doc(userId).get();
            console.log("User Details Retrieved Successfully");

            // Check if user exists
            if(userData.exists){
                return {
                    success: true,
                    data: {
                        id: userId,
                        name: userData.data().name,
                        email_address: userData.data().email_address,
                        phone_number: userData.data().phone_number
                    }
                }
            }
            else{
                return {
                    success: false,
                    message: "User does not exist."
                }
            }
        }
        else{
            return {
                success: false,
                message: "User not logged in."
            }
        }
    }
    catch(error){
        console.log(error);
        return {
            success: false,
            error: error
        }
    }
}

module.exports = {
    firebaseSignup,
    firebaseLogin,
    firebaseForgotPassword,
    firebaseChangePassword,
    firebaseUserInfo
}