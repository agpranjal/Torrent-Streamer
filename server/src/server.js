const express = require('express');
const path = require('path');
const logger = require('../config/logger');
const { torrentRouter, torrentBrowseRouter } = require('./routes');

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, '..', '..', 'client', 'build', 'static')));
app.use('/', torrentRouter);
app.use('/browse', torrentBrowseRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

let server;

function main() {
  server = app.listen(PORT, '0.0.0.0');
  logger.info(`Server started at (0.0.0.0:${PORT})`);
}

function exitHandler() {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

function unexpectedErrorHandler(error) {
  logger.error(error);
  exitHandler();
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

main();
