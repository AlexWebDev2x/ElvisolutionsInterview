const { Sequelize, DataTypes } = require('sequelize');

// Example of required environment variables:
// DATABASE_NAME = elvisolutions
// DATABASE_URI = postgresql://user:password@server:port/
const sequelize = new Sequelize( process.env.DATABASE_URI + process.env.DATABASE_NAME, { dialect: 'postgres' } );

const User = sequelize.define('User', 
    {
        id: 
            {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },

        name:
            {
                type: DataTypes.STRING(250),
                allowNull: false,
            },

        surname:
            {
                type: DataTypes.STRING(250),
                allowNull: false,
            },

        birth_date:
            {
                type: DataTypes.DATE,
                allowNull: false,
            },

        email:
            {
                type: DataTypes.STRING(500),
                allowNull: false,
            },

        password:
            {
                type: DataTypes.STRING(500),
                allowNull: false,
            },

        phone:
            {
                type: DataTypes.STRING(500),
                allowNull: false,
            },

        identity:
            {
                type: DataTypes.STRING(500),
                allowNull: false,
            },

        passport_number:
            {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
    },
    {

    });

module.exports = User;
