// Import Packages
const colors = require('colors');
const jwt = require("jsonwebtoken");

// Import Services and Utils
const { encryptPassword, decrptPassword } = require('./encryptionHandlerService');
const {issueJWT} = require('../utils/jwtHelper');

// Import Module 
const User = require('../models/DOB/t_user.model');

const userInfoService = async (authToken) => {
    try {
        let loggedInUser = decodeJWT(authToken);

        if(loggedInUser){
            let user = await User.findByPk({
                where: {
                    id: loggedInUser
                }
            });

            if(user){
                return {
                    success: true,
                    message: "User Info Fetched Successfully.",
                    data: user
                };
            }
            else{
                return {
                    success: false,
                    message: "User Info Fetched Failed."
                };
            }
        }
    }
    catch (error) {
        console.log(colors.red("Error"));
        console.log(error);
        return {
            success: false,
            error: error
        };
    }
}

//Function to Signup User
const userSignUpService = async (data) => {
    try{
        const { name, email_address, password, phone_number } = data;

        // Check if phone_number already exists
        let checkPhoneNumber = await User.findOne({
            where: {
                phone_number: phone_number
            }
        });

        if(checkPhoneNumber){
            return {
                success: false,
                message: "Phone number already exists."
            }
        }

        // Check if email_address already exists
        let checkEmail = await User.findOne({
            where: {
                email_address: email_address
            }
        });

        if(checkEmail){
            return {
                success: false,
                message: "Email address already exists."
            }
        }

        if(!checkEmail && !checkPhoneNumber){
            if(name && email_address && password && phone_number){

                let encryptedPassword = await encryptPassword(password);
                let user = await User.create({
                    name: name,
                    email_address: email_address,
                    password: encryptedPassword.password,
                    iv: encryptedPassword.iv,
                    phone_number: phone_number,
                });

                if(user){
                    const token = issueJWT(user);
                    if(token){
                        return {
                            success: true,
                            message: "User created successfully.",
                            data: {
                                name: user.name,
                                email_address: user.email_address,
                                phone_number: user.phone_number,
                                token: token
                            }
                        }
                    }
                    else{
                        return {
                            success: false,
                            message: "Error While creating Token."
                        }
                    }
                }
                else{
                    return {
                        success: false,
                        message: "User not created."
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
                message: "User already exists."
            }
        }
    }
    catch(error){
        console.log(error);
        return {
            success: false,
            error: error
        };
    }
}

// Function to Login User
const userLoginService = async (data) => {
    try{

        const { email_address, password } = data;
        let checkEmail = {}

        if(email_address != null){
            checkEmail = await User.findOne({
                where: {
                    email_address: email_address
                }
            });
        }

        if(!checkEmail){
            return {
                success: false,
                message: "User does not exist."
            }
        }
        else{

            let token = issueJWT(checkEmail);

            let passwordData = {
                password: checkEmail.password,
                iv: checkEmail.iv
            }
            console.log("Password Data: ",colors.green(passwordData))
            let decryptedPassword = await decrptPassword(passwordData);
            console.log("Decrypted Password: ",colors.green(decryptedPassword))

            if(decryptedPassword.success){
                if(decryptedPassword.password == password){
                    return {
                        success: true,
                        message: "User logged in successfully.",
                        data: {
                            id: checkEmail.id,
                            name: checkEmail.name,
                            email_address: checkEmail.email_address,
                            phone_number: checkEmail.phone_number,
                            token: token
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
    }
    catch(error){
        console.log(colors.red("Error"));
        console.log(error);
        return {
            success: false,
            error: error
        };
    }
}

module.exports = {
    userInfoService,
    userSignUpService,
    userLoginService
}