const { UUID, UUIDV4, STRING, BOOLEAN, TIME  } = require('sequelize');

const sequelize = require('../../db/db');

// Password Model
const Password = sequelize.define("Password", {
        id:{
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        title: {
            type: STRING,
            allowNull: false
        },
        password: {
            type: STRING,
            allowNull: false
        },
        iv: {
            type: STRING,
            allowNull: false
        },
        created_by: {
            type: STRING,
            allowNull: false
        },
        modified_by: {
            type: STRING,
            allowNull: false
        },
    }, { underscored: true }
);

module.exports = Password;