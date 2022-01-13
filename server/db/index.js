// Example of required environment variables:
// DATABASE_NAME = elvisolutions
// DATABASE_URI = postgresql://user:password@server:port/

module.exports = new Promise( (resolve, reject) =>
    {
        const { Client } = require('pg');
        const { Sequelize } = require('sequelize');
        const dbName = process.env.DATABASE_NAME;
        const client = new Client(process.env.DATABASE_URI + 'postgres');
    
        client.connect( err =>
            {
                if (err)
                    reject(err);
                else
                    client.query('CREATE DATABASE ' + dbName, err =>
                        {
                            if (err)
                                console.log(`Database '${ dbName }' exists.`);
                            else
                                console.log(`Database '${ dbName }' has been successfully created.`);

                            client.end();

                            resolve(new Sequelize( process.env.DATABASE_URI + process.env.DATABASE_NAME ));
                        });
            });
    });

