const express = require('express');
const path = require('path');
const { torrentRouter, torrentBrowseRouter } = require('./routes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, '..', '..', 'client', 'build', 'static')));
app.use('/', torrentRouter);
app.use('/browse', torrentBrowseRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Server started at', PORT);
  console.log();
});
