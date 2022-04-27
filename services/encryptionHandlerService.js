// Import Packages
const crypto = require('crypto');

// Function to encrypt password
const encryptPassword = async (password) => {
    try {
        // Generate random 16 digit IV 
        const iv = Buffer.from(crypto.randomBytes(16));

        // Generate Encrypted Cipher
        const cipher = crypto.createCipheriv(
            'aes-256-ctr', 
            Buffer.from(process.env.ENCRYPTION_KEY), 
            iv
        );

        // Generate Encrypted Password
        const encryptedPassword = Buffer.concat([
            cipher.update(password), 
            cipher.final()
        ]);

        if(encryptedPassword){
            return {
                success: true,
                iv: iv.toString('hex'),
                password: encryptedPassword.toString('hex')
            };
        }
        else{
            return {
                success: false,
                message: "Password Encryption Failed"
            };
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Password Encryption Failed"
        }
    }
}

// Function to decrypt password
const decrptPassword = async (encryption) => {
    try {
        // Generate Decrypted Cipher
        const decipher = crypto.createDecipheriv(
            'aes-256-ctr',
            Buffer.from(process.env.ENCRYPTION_KEY), 
            Buffer.from(encryption.iv, 'hex')
        );

        // Generate Decrypted Password
        const decryptedPassword = Buffer.concat([
            decipher.update(Buffer.from(encryption.password, 'hex')), 
            decipher.final()
        ]);

        if(decryptedPassword){
            return {
                success: true,
                password: decryptedPassword.toString()
            };
        }
        else{
            return {
                success: false,
                message: "Password Decryption Failed"
            };
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Password Decryption Failed"
        }
    }
}

module.exports = {
    encryptPassword,
    decrptPassword
}