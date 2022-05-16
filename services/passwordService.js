// Import Packages
const colors = require('colors');

// Import Sevices
const { encryptPassword, decrptPassword } = require('./encryptionHandlerService');
const { decodeJWT } = require('../utils/jwtHelper');
const firebase = require('../firebase/firebase_connect')

// Import Models
// const Users = require('../models/DOB/t_user.model');
// const Password = require('../models/DOB/t_password.model');

// Function to save Password in Firebase
const addPasswordService = async (data, authToken) => {
    try {
        const { title, password } = data;

        // Decodes Auth Token to get user ID
        let loggedInUser = decodeJWT(authToken);
        console.log("LoggedInUser ID: ",colors.green(loggedInUser));

        // Get User deatils
        let userData = await firebase.collection('users').doc(loggedInUser).get();
        if(userData.exists){
            console.log(colors.green("User Exists!"));
            // Encrypt Password
            let encryptedPassword = await encryptPassword(password);
            if (encryptedPassword.success) {
                console.log(colors.green("Password Encrypted!"));
                let addPassword = await firebase.collection('passwords').add({
                    title: title,
                    password: encryptedPassword.password,
                    iv: encryptedPassword.iv,
                    created_by: loggedInUser
                });
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
        
        // If User exists
        // if(getUserDetails){
        //     // Encrypt Password
        //     let encryptedPassword = await encryptPassword(password);
        //     if (encryptedPassword.success) {
        //         // If encrypted password generated successfully
        //         let createPasswordData = {
        //             title: title,
        //             password: encryptedPassword.password,
        //             iv: encryptedPassword.iv,
        //             created_by: loggedInUser,
        //             modified_by: loggedInUser
        //         }
        //         // Add Password in DB
        //         let addPasswordToDb = await Password.create(createPasswordData);

        //         if (addPasswordToDb) {
        //             return {
        //                 success: true,
        //                 message: "Password added successfully."
        //             };
        //         }
        //         else{
        //             return {
        //                 success: false,
        //                 message: "Password not added."
        //             };
        //         }
        //     }
        //     else {
        //         return {
        //             success: false,
        //             message: "Password Encryption Failed"
        //         }
        //     }
            
        // }
        // else {
        //     return {
        //         success: false,
        //         message: "User not found."
        //     };
        // }
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
        let { title, password } = data;

        // Decodes Auth Token to get user ID
        let loggedInUser = decodeJWT(authToken);
        console.log("User ID: ",colors.green(loggedInUser));

        // Get User deatils
        let userData = await firebase.collection('users').doc(loggedInUser).get();
        if(userData.exists){
            console.log(colors.green("User Exists!"));
            
            // Check if password exists
            let checkPasswordExists = await firebase.collection('passwords').doc(passwordId).get();
            if(checkPasswordExists.exists){
                console.log(colors.green("Password Exists!"));

                // Encrypt new Password
                let encryptedPassword = await encryptPassword(password);
                if (encryptedPassword.success) {
                    console.log(colors.green("Password Encrypted!"));
                    let updatePassword = await firebase.collection('passwords').doc(passwordId).update({
                        title: title,
                        password: encryptedPassword.password,
                        iv: encryptedPassword.iv
                    });

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

        // // Get User deatils
        // let getUserDetails = await Users.findByPk(loggedInUser);

        // // If User exists
        // if(getUserDetails){
        //     // Get Password details
        //     let getPassword = await Password.findByPk(passwordId);

        //     if (getPassword) {
        //         // If Password exists
        //         // Encrypt Password
        //         let encryptedPassword = await encryptPassword(password);
        //         if (encryptedPassword.success) {
        //             // If encrypted password generated successfully
        //             let updatePasswordData = {
        //                 title: title,
        //                 password: encryptedPassword.password,
        //                 iv: encryptedPassword.iv,
        //                 modified_by: loggedInUser
        //             }
        //             // Update Password in DB
        //             let updatePassword = await Password.update(updatePasswordData, {
        //                 where: {
        //                     id: passwordId,
        //                     created_by: loggedInUser
        //                 }
        //             });
        //             if (updatePassword) {
        //                 return {
        //                     success: true,
        //                     message: "Password updated successfully."
        //                 };
        //             }
        //             else {
        //                 return {
        //                     success: false,
        //                     message: "Password not updated."
        //                 };
        //             }
        //         }
        //         else {
        //             return {
        //                 success: false,
        //                 message: "Password Encryption Failed"
        //             }
        //         }
        //     }
        //     else {
        //         return {
        //             success: false,
        //             message: "Password not found."
        //         };
        //     }
        // }
        // else{
        //     return {
        //         success: false,
        //         message: "User not found."
        //     };
        // }
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

        let userData = await firebase.collection('users').doc(loggedInUser).get();

        // Check if user exists
        if(userData.exists){
            console.log(colors.green("User Found!"))
            let passwordData = await firebase.collection('passwords').doc(passwordId).get();

            if(passwordData.exists){
                console.log(colors.green("Password Found!"))
                // decrypt password
                let decrptPasswordData = {
                    password: passwordData.data().password,
                    iv: passwordData.data().iv
                }
                let decryptedPassword = await decrptPassword(decrptPasswordData);
                console.log("Decrypted Password: ",colors.green(decryptedPassword));

                // If decrypted password generated successfully
                if (decryptedPassword.success) {
                    return {
                        success: true,
                        data: decryptedPassword.password
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

        // Get User deatils
        // let getUserDetails = await Users.findByPk(loggedInUser);

        // // If User exists
        // if(getUserDetails){

        //     // Get Password details
        //     let getPassword = await Password.findByPk(passwordId);

        //     // If Password exists
        //     if (getPassword) {
        //         // Decrypt Password
        //         let decryptedPassword = await decrptPassword(getPassword);
        //         console.log("Decrypted Password: ",colors.green(decryptedPassword));
        //         if (decryptedPassword.success) {
        //             return {
        //                 success: true,
        //                 data: {
        //                     id: getPassword.id,
        //                     title: getPassword.title,
        //                     password: decryptedPassword.password
        //                 }
        //             };
        //         }
        //         else {
        //             return {
        //                 success: false,
        //                 message: "Password Decryption Failed"
        //             };
        //         }
        //     }
        //     else {
        //         return {
        //             success: false,
        //             message: "Password not found."
        //         };
        //     }
        // }
        // else{
        //     return {
        //         success: false,
        //         message: "User not found."
        //     };
        // }
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

        let userData = await firebase.collection('users').doc(loggedInUser).get();

        if(userData.exists){
            console.log(colors.green("User Found!"))

            let passwordData = await firebase.collection('passwords').doc(passwordId).get();

            if(passwordData.exists){
                console.log(colors.green("Password Found!"))

                // Delete Password from firebase
                let deletePassword = await firebase.collection('passwords').doc(passwordId).delete();

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

        // // Get User deatils
        // let getUserDetails = await Users.findByPk(loggedInUser);

        // // If User exists
        // if(getUserDetails){
        //     // Get Password details
        //     let getPassword = await Password.findByPk(passwordId);

        //     // If Password exists
        //     if (getPassword) {
        //         // Delete Password
        //         let deletePassword = await Password.destroy({
        //             where: {
        //                 id: passwordId,
        //                 created_by: loggedInUser
        //             }
        //         });
        //         if (deletePassword) {
        //             return {
        //                 success: true,
        //                 message: "Password deleted successfully."
        //             };
        //         }
        //         else {
        //             return {
        //                 success: false,
        //                 message: "Password not deleted."
        //             };
        //         }
        //     }
        //     else {
        //         return {
        //             success: false,
        //             message: "Password not found."
        //         };
        //     }
        // }
        // else{
        //     return {
        //         success: false,
        //         message: "User not found."
        //     };
        // }
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
        let userData = await firebase.collection('users').doc(loggedInUser).get();

        if(userData.exists){
            console.log(colors.green("User Found!"))

            // Get all Passwords
            let allPasswords = await firebase.collection('passwords').where('created_by', '==', loggedInUser).get();

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
                        title: doc.data().title,
                        password: doc.data().password
                    });
                });
                console.log(colors.green("Passwords: ", passwords));
                return {
                    success: true,
                    data: passwords
                };
            }
        }
        else{
            return {
                success: false,
                message: "User not found."
            };
        }

        // // If User exists
        // if(getUserDetails){
        //     // Get all Passwords
        //     let getAllPasswords = await Password.findAll({
        //         where: {
        //             created_by: loggedInUser
        //         }
        //     });
        //     // If Passwords exists
        //     if(getAllPasswords.length > 0){
        //         return {
        //             success: true,
        //             passwords: getAllPasswords
        //         };
        //     }
        //     else{
        //         return {
        //             success: false,
        //             message: "No passwords found."
        //         };
        //     }
        // }
        // else{
        //     return {
        //         success: false,
        //         message: "User not found."
        //     };
        // }
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

        // Get User deatils
        // let getUserDetails = await Users.findByPk(loggedInUser);
        // if(getUserDetails){
            
        // Get User deatils
        let userData = await firebase.collection('users').doc(loggedInUser).get();

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