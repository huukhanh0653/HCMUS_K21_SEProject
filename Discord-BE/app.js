const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const multer = require("multer");
const indexRouter = require("./routes/index");
const customerRouter = require("./routes/customer");
const adminRouter = require("./routes/admin");
const companyRouter = require("./routes/company");
require("dotenv").config();
const session = require("express-session");
const app = express();




app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

require("./model/update_membershipRank");

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const upload = multer(); // Cấu hình multer để xử lý form-data

app.use("/", indexRouter);
// app.use("/customer", customerRouter);
// app.use("/admin", adminRouter);
// app.use("/company", companyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

module.exports = app;
