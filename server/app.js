const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const usersRouter = require('./routes/user');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.use( cors() );
app.options( '*', cors() );

// Body parser, reading data from body into req.body
app.use( bodyParser.json(   // Add simple middleware to process only requests with 'Content-Type' header set to 'application/json'
    {
        limit: '16kb'       // limit maximum size of incoming data
    }) );

app.use('/api/v1/users', usersRouter);

app.get('/', (req, res) => res.sendFile("index.html") );

app.all( '*', (req, res, next) => 
    next(new AppError(`Can't find ${ req.originalUrl } on this server!`, 404)));

module.exports = app;
