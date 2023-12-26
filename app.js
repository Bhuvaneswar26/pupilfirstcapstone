/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//BuiltIn Pacakges importing
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const csrf = require("tiny-csrf");
const saltRounds = 10;

//importing models
const { User } = require("./models");
const Sequelize = require("sequelize");

//Routes importing
const signup = require("./routes/signup");

//creating the app server
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//using flash
app.use(flash());

//midllware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("ssh some key!"));
app.use(express.static(path.join(__dirname, "public")));

//session midllware setup
app.use(
  session({
    secret: "this is the secret key for lms",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 100,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
console.log("Passport initialization completed successfully");

//defing the authUser function for local  strategy
const authUser = async (mail, password, done) => {
  try {
    const user = await User.findOne({ where: { email: mail } });
    if (!user) {
      console.log("first if", user);
      return done(null, false, { message: "User Not Found" });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Invalid Password" });
      }
    });
  } catch (err) {
    console.error("Error in authUser:", err);
    return done(err);
  }
};

//defining which strategey of passportjs to use
passport.use(
  new LocalStrategy(
    {
      usernameField: "mail",
      passwordField: "password",
    },
    authUser,
  ),
);

//serialing the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//deserializing the user
passport.deserializeUser((id, done) => {
  console.log("hiii");
  User.findByPk(id)
    .then((user) => {
      console.log(user);
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

//defining the middleware function for checking the user is loged in or not
const isLogedIn = (request, response, next) => {
  if (request.isAuthenticated) {
    next();
  } else {
    response.redirect("/login");
  }
};
const logincheck = (request, response) => {
  if (request.isAuthenticated) {
    response.redirect("/home");
  } else {
    response.redirect("/login");
  }
};

//csrf token setup
app.use(csrf("123456789iamasecret987654321look", ["POST", "PUT", "DELETE"]));

//defining the routes
app.get("/login", isLogedIn, (request, response) => {
  response.render("login", {
    error: request.flash("error"),
    csrfToken: request.csrfToken(),
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    console.log("test user", req.user);
    res.render("educatorhome");
  },
);

app.use("/signup", signup);

app.use("/", logincheck);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal Server Error" + err);
});

//exporting the app
module.exports = app;
