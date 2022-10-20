// Import Packages
const colors = require('colors');

// Import Firebase Database Connection
const firebase = require('../firebase/firebase_connect')

// Import Sevices
const { 
    encryptPassword, 
    decrptPassword 
} = require('./encryptionHandlerService');
const { decodeJWT } = require('../utils/jwtHelper');

// Function to save Password in Firebase
const addPasswordService = async (data, authToken) => {
    try {
        const { userName, title, password } = data;

        // Decodes Auth Token to get user ID
        let loggedInUser = decodeJWT(authToken);
        console.log("LoggedInUser ID: ",colors.green(loggedInUser));

        // Get User deatils
        console.log("Getting User Details");
        let userData = await firebase.collection('users').doc(loggedInUser).get();
        console.log("User Data Retrieved Successfully!");

        // If User exists
        if(userData.exists){
            console.log(colors.green("User Exists!"));
            // Encrypt Password
            let encryptedPassword = await encryptPassword(password);
            // If password encrypted successfully
            if (encryptedPassword.success) {
                console.log(colors.green("Password Encrypted!"));
                // Save Data in Firebase
                let addPassword = await firebase.collection('passwords').add({
                    userName: userName,
                    title: title,
                    password: encryptedPassword.password,
                    iv: encryptedPassword.iv,
                    created_by: loggedInUser
                });
                // If Password saved successfully
                if (addPassword) {
                    console.log(colors.green("Password added successfully!"));
                    return {
                        success: true,
                        message: "Password saved successfully"
                    }
                } else {
                    console.log(colors.red("Password not saved!"));
                    return {
                        success: false,
                        message: "Password not saved"
                    }
                }
            }
            else {
                console.log(colors.red("Password encryption failed!"));
                return {
                    success: false,
                    message: "Password encryption failed!"
                }
            }
        }
        else{
            return {
                success: false,
                message: "User not found"
            }
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            error: error
        };
    }
}

// Function to update Password in DB
const updatePasswordService = async (passwordId ,data, authToken) => {
    try{
        let { userName, title, password } = data;

        // Decodes Auth Token to get user ID
        let loggedInUser = decodeJWT(authToken);
        console.log("User ID: ",colors.green(loggedInUser));

        // Get User deatils
        console.log("Getting User Details");
        let userData = await firebase.collection('users').doc(loggedInUser).get();
        console.log("User Data Retrieved Successfully!");

        // If User exists
        if(userData.exists){
            console.log(colors.green("User Exists!"));
            
            // Check if password exists
            console.log("Checking Password Exists");
            let checkPasswordExists = await firebase.collection('passwords').doc(passwordId).get();
            console.log("Check Password Exists");

            if(checkPasswordExists.exists){
                console.log(colors.green("Password Exists!"));

                // Check if Password is created by logged in user
                if(checkPasswordExists.data().created_by === loggedInUser){
                    // Encrypt new Password
                    let encryptedPassword = await encryptPassword(password);
                    if (encryptedPassword.success) {
                        console.log(colors.green("Password Encrypted!"));
                        // Update Password in Firebase
                        let updatePassword = await firebase.collection('passwords').doc(passwordId).update({
                            userName: userName,
                            title: title,
                            password: encryptedPassword.password,
                            iv: encryptedPassword.iv
                        });

                        // If Password updated successfully
                        if (updatePassword) {
                            console.log(colors.green("Password updated successfully!"));
                            return {
                                success: true,
                                message: "Password updated successfully"
                            }
                        }
                        else {
                            console.log(colors.red("Password not updated!"));
                            return {
                                success: false,
                                message: "Password not updated"
                            }
                        }
                    }
                    else {
                        console.log(colors.red("Password encryption failed!"));
                        return {
                            success: false,
                            message: "Password encryption failed!"
                        }
                    }
                }
                else{
                    console.log(colors.red("Password not created by logged in user!"));
                    return {
                        success: false,
                        message: "Password not created by logged in user!"
                    }
                }
            }
            else{
                return {
                    success: false,
                    message: "Password not found"
                }
            }
        }
        else{
            return {
                success: false,
                message: "User not found"
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

// Function to retrieve Password by Id from Firebase
const getPasswordServiceById = async (passwordId, authToken) => {
    try {
        // Decodes Auth Token to get user ID
        let loggedInUser = decodeJWT(authToken);
        console.log("LoggedInUser ID: ",colors.green(loggedInUser));

        // Get User deatils
        console.log("Getting User Details");
        let userData = await firebase.collection('users').doc(loggedInUser).get();
        console.log("User Data Retrieved Successfully!");

        // Check if user exists
        if(userData.exists){
            console.log(colors.green("User Found!"))

            console.log("Getting Password Details");
            let passwordData = await firebase.collection('passwords').doc(passwordId).get();
            console.log("Password Data Retrieved Successfully!");

            // Check if password exists
            if(passwordData.exists){
                console.log(colors.green("Password Found!"))

                // Check if Password is created by logged in user
                if(passwordData.data().created_by === loggedInUser){
                    // decrypt password
                    let decrptPasswordData = {
                        password: passwordData.data().password,
                        iv: passwordData.data().iv
                    }
                    let decryptedPassword = await decrptPassword(decrptPasswordData);

                    // If decrypted password generated successfully
                    if (decryptedPassword.success) {
                        return {
                            success: true,
                            data: {
                                id: passwordId,
                                userName: passwordData.data().userName,
                                title: passwordData.data().title,
                                password: decryptedPassword.password
                            }
                        }
                    }
                    else {
                        console.log(colors.red("Password Decryption Failed!"))
                        return {
                            success: false,
                            message: "Password Decryption Failed"
                        }
                    }
                }
                else{
                    console.log(colors.red("Password not created by logged in user!"))
                    return {
                        success: false,
                        message: "Password not created by logged in user"
                    }
                }
            }
            else{
                console.log(colors.red("Password Not Found!"))
                return {
                    success: false,
                    message: "Password not found."
                };
            }
        }
        else{
            console.log(colors.red("User Not Found!"))
            return {
                success: false,
                message: "User not found"
            }
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            error: error
        };
    }
}

// Function to delete Password from Firebase
const deletePasswordService = async (passwordId, authToken) => {
    try{

        // Decodes Auth Token to get user ID
        let loggedInUser = decodeJWT(authToken);
        console.log("User ID: ",colors.green(loggedInUser));

        // Get User deatils
        console.log("Getting User Details");
        let userData = await firebase.collection('users').doc(loggedInUser).get();
        console.log("User Data Retrieved Successfully!");

        // Check if user exists
        if(userData.exists){
            console.log(colors.green("User Found!"))

            console.log("Getting Password Details");
            let passwordData = await firebase.collection('passwords').doc(passwordId).get();
            console.log("Password Data Retrieved Successfully!");

            // Check if password exists
            if(passwordData.exists){
                console.log(colors.green("Password Found!"))

                // Check if Password is created by logged in user
                if(passwordData.data().created_by === loggedInUser){
                    // Delete Password from firebase
                    console.log("Deleting Password");
                    let deletePassword = await firebase.collection('passwords').doc(passwordId).delete();
                    console.log("Password Deleted Successfully!");

                    // If Password deleted successfully
                    if(deletePassword){
                        console.log(colors.green("Password Deleted!"))
                        return {
                            success: true,
                            message: "Password deleted successfully."
                        };
                    }
                    else{
                        console.log(colors.red("Password Not Deleted!"))
                        return {
                            success: false,
                            message: "Password not deleted."
                        };
                    }
                }
                else{
                    console.log(colors.red("Password not created by logged in user!"))
                    return {
                        success: false,
                        message: "Password not created by logged in user"
                    }
                }
            }
            else{
                console.log(colors.red("Password Not Found!"))
                return {
                    success: false,
                    message: "Password not found."
                };
            }
        }
        else{
            return {
                success: false,
                message: "User not found."
            };
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

// Function to retrive all Passwords from DB
const getAllPasswordsService = async (token) => {
    try{

        // Decodes Auth Token to get user ID
        let loggedInUser = decodeJWT(token);
        console.log("User ID: ",colors.green(loggedInUser));

        // Get User deatils
        console.log("Getting User Details");
        let userData = await firebase.collection('users').doc(loggedInUser).get();
        console.log("User Data Retrieved Successfully!");

        // Check if user exists
        if(userData.exists){
            console.log(colors.green("User Found!"))

            // Get all Passwords
            console.log("Getting all Passwords");
            let allPasswords = await firebase.collection('passwords').where('created_by', '==', loggedInUser).get();
            console.log("All Passwords Retrieved Successfully!");

            // If Passwords not found
            if(allPasswords.empty){
                console.log(colors.red("No Passwords Found!"))
                return {
                    success: false,
                    message: "No Passwords found."
                };
            }
            else{
                console.log(colors.green("Passwords Found!"))
                let passwords = [];
                allPasswords.forEach(doc => {
                    passwords.push({
                        id: doc.id,
                        userName: doc.data().userName,
                        title: doc.data().title,
                        password: doc.data().password
                    });
                });
                console.log(colors.green("Passwords: ", passwords));
                let finalData = {
                    userData: userData,
                    passwords: passwords
                }
                return {
                    success: true,
                    data: finalData
                };
            }
        }
        else{
            return {
                success: false,
                message: "User not found."
            };
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

// Function to generate 16 digit random password
const generatePasswordService = async (authToken) => {
    try{
        // Decodes Auth Token to get user ID
        let loggedInUser = decodeJWT(authToken);
        console.log("User ID: ",colors.green(loggedInUser));
            
        // Get User deatils
        console.log("Getting User Details");
        let userData = await firebase.collection('users').doc(loggedInUser).get();
        console.log("User Data Retrieved Successfully!");

        // If User exists
        if(userData.exists){
            console.log(colors.green("User Found!"))
            // Generate random 16 character string
            let generatedPassword = await generatePassword(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*_');

            // If random string generated successfully
            if(generatedPassword){
                return{
                    success: true,
                    password: generatedPassword
                }
            }
            else{
                return{
                    success: false,
                    message: "Password not generated."
                }
            }
        }
        else{
            return {
                success: false,
                message: "User not found."
            };
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

// Function to generate random password
const generatePassword = async (length, chars) => {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

module.exports = {
    addPasswordService,
    updatePasswordService,
    deletePasswordService,
    getPasswordServiceById,
    getAllPasswordsService,
    generatePasswordService
};