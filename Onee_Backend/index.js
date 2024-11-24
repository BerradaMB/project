const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const familleRoute = require('./routes/famille');
const materialRoute = require('./routes/material');
const ticketRoute = require('./routes/ticket');
const dashboardRoute = require('./routes/dashboard'); 
const app =express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user',userRoute);
app.use('/famille',familleRoute);
app.use('/material',materialRoute);
app.use('/ticket',ticketRoute);
app.use('/dashboard',dashboardRoute);

module.exports = app;


