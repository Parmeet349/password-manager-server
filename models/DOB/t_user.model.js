const { UUID, UUIDV4, STRING, BOOLEAN, TIME  } = require('sequelize');

const sequelize = require('../../db/db');

// User Model
const Users = sequelize.define("Users", {
        id:{
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        name: {
            type: STRING,
            allowNull: false
        },
        email_address: {
            type: STRING,
            allowNull: false
        },
        password: {
            type: STRING,
            allowNull: false
        },
        phone_number: {
            type: STRING,
            allowNull: false
        },
        iv: {
            type: STRING,
            allowNull: false
        },
    }, { underscored: true }
);

module.exports = Users;