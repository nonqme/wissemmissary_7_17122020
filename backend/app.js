const express = require('express');

const userRoutes = require('./routes/users');
const db = require('./db/mysql');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json({ limit: '10kb'}));
app.use(express.urlencoded({
    extended: true
  }));

app.use('/api/auth', userRoutes);





module.exports = app;