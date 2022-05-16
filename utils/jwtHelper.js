const colors = require('colors');
const jwt = require('jsonwebtoken');
// 
const KEY = process.env.TOKEN_KEY;

// Generate JWT token
const issueJWT = (user) => {
    // Sign JWT token
    const token = jwt.sign({ 
        user_id: user.id, 
        email_address: user.email_address 
    },
    process.env.TOKEN_KEY,
    {
        expiresIn: "1y", // expires in 1 year
    });
    console.log("Token: ",colors.green(token));

    return token;
};

// Decode JWT token
const decodeJWT = (token) => {
    // Remove Bearer from token
    const jwtToken = token.split(" ")[1];
    // Decode JWT token
    let loggedInUser = jwt.verify(jwtToken, KEY);
    loggedInUser = loggedInUser.user_id;
    return loggedInUser;
};

module.exports = {
    issueJWT,
    decodeJWT
};