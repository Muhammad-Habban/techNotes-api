const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("NOT Allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccesStatus: 200,
};

module.exports = corsOptions;
