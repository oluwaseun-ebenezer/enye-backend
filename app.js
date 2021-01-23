// Creating the express app.

const express = require('express');

const rateRoute = require('./routes/rate');

const app = express();

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();

});

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// api route
app.use('/api', rateRoute);

module.exports = app;
