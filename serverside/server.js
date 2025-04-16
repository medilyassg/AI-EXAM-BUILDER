const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Vercel and Express!');
});

module.exports = serverless(app);
