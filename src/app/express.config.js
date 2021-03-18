const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../router');
require('dotenv').config()

const app = express();

// error log 
require('./winston');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

//security
// app.use(helmet());


// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount api v1 routes with multi language features
app.use(`/api/${config.get('site.version')}`, cors(), (req, res, next) => {

  next();
}, routes);

module.exports = app;