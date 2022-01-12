const dotenv = require('dotenv');

dotenv.config();
// console.log('env:', dotenv.config());

const errorHandlers = require('./utils/errorHandlers');

// Handle globally unhandled exceptions using process event handler for 'uncaughtException' event:
process.on('uncaughtException', errorHandlers.uncaughtException);

void async function()
{
    const db = await require('./db');

    try
    {
        // Check connection to PostreSQL
        await db.authenticate();

        // Update Users table
        const User = require('./models/users');
        User.sync({ alter: true });

        console.log('Connection to PostgreSQL has been established successfully.');
    }
    catch (error)
    {
        console.error('Unable to connect to the PostgreSQL:', error);
        process.exit(-3);
    }

    // Run Server
    const app = require('./app');

    const port = process.env.PORT || 4000;
    const server = app.listen( port, () => console.log(`APP IS RUNNING ON PORT ${ port }...`) ); 

    // Handle globally unhandled rejections (from promises) using process event handler for 'unhandledRejection' event:
    process.on('unhandledRejection', errorHandlers.unhandledRejection(server));

    // *** NOTEs about Heroku ***
    // Heroku stores and runs our app in a container named Dyno and 
    // sends every 24 hours the SEG_TERM signal to rerun the app to keep it in a healthy state
    // ***
    process.on('SIGTERM', errorHandlers.sigTerm(server));
}();
