const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions);
const knex = require('../data/dbConfig.js');

const sessionConfig = {
    name: 'monkey',
    secret: 'keep it secret, keep it safe!',
    saveUninitialized: false, // GDPR laws against setting cookies automatically
    resave: false,
    // do not forget to add the 'new' keyword
    store: new KnexSessionStore({
        knex, // import from dbConfig.js
        createtable: true,
        // optional
        clearInterval: 1000 * 60 * 10,
        tablename: 'sessions',
        sidfieldname: 'sid'
    }),
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false, // dynamically change to true in production environment
        httpOnly: true
    }
};

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(sessions(sessionConfig));  // add a req.session object
};