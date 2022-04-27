// Database Configuration
module.exports = {
    HOST_LOCAL: "localhost",
    USER_LOCAL: "root",
    PASSWORD_LOCAL: "Password_123_!",
    DB_LOCAL: "passwordmanager",

    dialect: "mysql",
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

};