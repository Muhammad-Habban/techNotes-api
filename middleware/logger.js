const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { log } = require("console");

const logEvents = async (message, logFileName) => {
  // basically we are creating a new date with a format
  const dateItem = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  // then we are creating a logItem meaning a string with a time and a specific id and a log message.
  // each logItem will be a new Line inside a log file in logs folder
  const logItem = `${dateItem}\t${uuid()}\t${message}\n`;
  // now we will check if logs directory exist, if it doesn't then we will create using fsPromises
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    // now we will create a new log file inside logs folder and write logItem inside it.
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(req.method + " " + req.path);
  // next basically tells it to move on to the next middleware or eventually the controller where a respone is sended
  next();
};

module.exports = { logger, logEvents };
