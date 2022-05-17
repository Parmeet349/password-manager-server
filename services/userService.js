// Import Packages
const colors = require('colors');
const jwt = require("jsonwebtoken");

// Import Services and Utils
const { encryptPassword, decrptPassword } = require('./encryptionHandlerService');
const {issueJWT} = require('../utils/jwtHelper');
const {decodeJWT} = require('../utils/jwtHelper');
const nodemailer = require("nodemailer");

const firebase = require('../firebase/firebase_connect')

// Import Module 
const User = require('../models/DOB/t_user.model');

// const userInfoService = async (authToken) => {
//     try {
//         let loggedInUser = decodeJWT(authToken);

//         if(loggedInUser){
//             let user = await User.findByPk({
//                 where: {
//                     id: loggedInUser
//                 }
//             });

//             if(user){
//                 return {
//                     success: true,
//                     message: "User Info Fetched Successfully.",
//                     data: user
//                 };
//             }
//             else{
//                 return {
//                     success: false,
//                     message: "User Info Fetched Failed."
//                 };
//             }
//         }
//     }
//     catch (error) {
//         console.log(colors.red("Error"));
//         console.log(error);
//         return {
//             success: false,
//             error: error
//         };
//     }
// }

//Function to Signup User
// const userSignUpService = async (data) => {
//     try{
//         const { name, email_address, password, phone_number } = data;

//         // Check if phone_number already exists
//         let checkPhoneNumber = await User.findOne({
//             where: {
//                 phone_number: phone_number
//             }
//         });

//         if(checkPhoneNumber){
//             return {
//                 success: false,
//                 message: "Phone number already exists."
//             }
//         }

//         // Check if email_address already exists
//         let checkEmail = await User.findOne({
//             where: {
//                 email_address: email_address
//             }
//         });

//         if(checkEmail){
//             return {
//                 success: false,
//                 message: "Email address already exists."
//             }
//         }

//         if(!checkEmail && !checkPhoneNumber){
//             if(name && email_address && password && phone_number){

//                 let encryptedPassword = await encryptPassword(password);
//                 let user = await User.create({
//                     name: name,
//                     email_address: email_address,
//                     password: encryptedPassword.password,
//                     iv: encryptedPassword.iv,
//                     phone_number: phone_number,
//                 });

//                 if(user){
//                     const token = issueJWT(user);
//                     if(token){
//                         return {
//                             success: true,
//                             message: "User created successfully.",
//                             data: {
//                                 name: user.name,
//                                 email_address: user.email_address,
//                                 phone_number: user.phone_number,
//                                 token: token
//                             }
//                         }
//                     }
//                     else{
//                         return {
//                             success: false,
//                             message: "Error While creating Token."
//                         }
//                     }
//                 }
//                 else{
//                     return {
//                         success: false,
//                         message: "User not created."
//                     }
//                 }
//             }
//             else{
//                 return {
//                     success: false,
//                     message: "Please fill all the fields."
//                 }
//             }
//         }
//         else{
//             return {
//                 success: false,
//                 message: "User already exists."
//             }
//         }
//     }
//     catch(error){
//         console.log(error);
//         return {
//             success: false,
//             error: error
//         };
//     }
// }

// Function to Login User
// const userLoginService = async (data) => {
//     try{

//         const { email_address, password } = data;
//         let checkEmail = {}

//         if(email_address != null){
//             checkEmail = await User.findOne({
//                 where: {
//                     email_address: email_address
//                 }
//             });
//         }

//         if(!checkEmail){
//             return {
//                 success: false,
//                 message: "User does not exist."
//             }
//         }
//         else{

//             let token = issueJWT(checkEmail);

//             let passwordData = {
//                 password: checkEmail.password,
//                 iv: checkEmail.iv
//             }
//             console.log("Password Data: ",colors.green(passwordData))
//             let decryptedPassword = await decrptPassword(passwordData);
//             console.log("Decrypted Password: ",colors.green(decryptedPassword))

//             if(decryptedPassword.success){
//                 if(decryptedPassword.password == password){
//                     return {
//                         success: true,
//                         message: "User logged in successfully.",
//                         data: {
//                             id: checkEmail.id,
//                             name: checkEmail.name,
//                             email_address: checkEmail.email_address,
//                             phone_number: checkEmail.phone_number,
//                             token: token
//                         }
//                     }
//                 }
//                 else{
//                     return {
//                         success: false,
//                         message: "Password is incorrect."
//                     }
//                 }
//             }
//         }
//     }
//     catch(error){
//         console.log(colors.red("Error"));
//         console.log(error);
//         return {
//             success: false,
//             error: error
//         };
//     }
// }



// Firebase User Signup
const firebaseSignup = async (data) => {
    try{
        const { name, email_address, password, phone_number } = data;

        // Check if phone_number already exists
        let checkPhoneNumber = await firebase.collection('users').where('phone_number', '==', phone_number).get();
        console.log("Checking Phone Number", checkPhoneNumber)

        if(checkPhoneNumber.empty){
            // Check if email_address already exists
            let checkEmail = await firebase.collection('users').where('email_address', '==', email_address).get();

            // Get User Details


            if(checkEmail.empty){
                if(name && email_address && password && phone_number){
                    
                    let encryptedPassword = await encryptPassword(password);
                    let user = await firebase.collection('users').add({
                        name: name,
                        email_address: email_address,
                        password: encryptedPassword.password,
                        iv: encryptedPassword.iv,
                        phone_number: phone_number,
                    });
                    console.log("User details", colors.magenta(user))
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
        return {
            success: true,
            message: "User created successfully."
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
        let checkEmail = await firebase.collection('users').where('email_address', '==', email_address).get();
        if(checkEmail.empty){
            return {
                success: false,
                message: "User does not exist. Please create an account."
            }
        }
        else{
            let user = checkEmail.docs[0].data();
            console.log("User Details", user)

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
            let decryptedPassword = await decrptPassword(passwordData);
            
            if(password === decryptedPassword.password){
                const token = issueJWT(tokenData);
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
        let checkEmail = await firebase.collection('users').where('email_address', '==', email_address).get();

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

const sendEmail = async (data) => {
    try{
        const { message, subject, email, userData } = data;
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
        let checkEmail = await firebase.collection('users').where('email_address', '==', email_address).get();
        
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
            let decryptedPassword = await decrptPassword(passwordData);
            console.log("Decrypted Password", decryptedPassword)
            if(password === decryptedPassword.password){
                let encryptedNewPassword = await encryptPassword(new_password);
                console.log("Encrypted Password", encryptedNewPassword)

                let id = checkEmail.docs[0].id;
                console.log(id)
                let updatePassword = await firebase.collection('users').doc(id).update({
                    password: encryptedNewPassword.password,
                    iv: encryptedNewPassword.iv
                });
                console.log("Update Password", updatePassword)
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
        let decodedToken = await decodeJWT(authToken);
        console.log("Decoded Token", decodedToken)
        if(decodedToken){
            let userId = decodedToken
            let userData = await firebase.collection('users').doc(userId).get();
            return {
                success: true,
                data: userData.data()
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
    // userInfoService,
    // userSignUpService,
    // userLoginService,
    firebaseSignup,
    firebaseLogin,
    firebaseForgotPassword,
    firebaseChangePassword,
    firebaseUserInfo
}