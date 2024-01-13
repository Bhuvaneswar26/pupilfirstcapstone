/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Built-in Packages importing
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const csrf = require("tiny-csrf");
const methodOverride = require("method-override");
const saltRounds = 10;

// Importing models
const { User } = require("./models");
const Sequelize = require("sequelize");

// Login security middleware
const {
  iseducator,
  isstudent,
  isLogedIn,
  logincheck,
} = require("./middleware.js");

// Routes importing
const signup = require("./routes/signup");
const educator = require("./routes/educator");
const student = require("./routes/student");

// Creating the app server
const app = express();

// EJS view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Setting up the static files
app.use(express.static(path.join(__dirname, "public")));

// Using flash
app.use(flash());

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser("ssh some key!"));
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

// Session middleware setup using connect-pg-simple
const sessionStore = new pgSession({
  conObject: {
    connectionString:
      process.env.NODE_ENV === "production"
        ? process.env.DATABASE_URL
        : "postgres://postgres:0826%40ABHUVI@localhost:5432/lms_dev_db",
  },
  tableName: "sessions",
});

app.use(
  session({
    secret: "this is the secret key for lms",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: sessionStore,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
console.log("Passport initialization completed successfully");

// Defining the authUser function for the local strategy
const authUser = async (mail, password, done) => {
  try {
    const user = await User.findOne({ where: { email: mail } });
    if (!user) {
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

// Defining which strategy of passportjs to use
passport.use(
  new LocalStrategy(
    {
      usernameField: "mail",
      passwordField: "password",
    },
    authUser,
  ),
);

// Serializing the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializing the user
passport.deserializeUser(async (id, done) => {
  await User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

// CSRF token setup
const csrfProtection = csrf("123456789iamasecret987654321look", [
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
]);
app.use(csrfProtection);

// Defining the routes
app.get("/login", isLogedIn, (request, response) => {
  response.render("login", {
    error: request.flash("error"),
    success: request.flash("success"),
    csrfToken: request.csrfToken(),
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    if (request.accepts("html")) {
      if (request.user.role === "educator") {
        response.redirect("/educator");
      } else {
        response.redirect("/student");
      }
    } else {
      response.status(200).json({
        user: request.user,
        message: "Login successful",
      });
    }
  },
);

app.use("/signup", csrfProtection, isLogedIn, signup);
app.use("/educator", csrfProtection, logincheck, iseducator, educator);
app.use("/student", csrfProtection, logincheck, student);

app.get("/signout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.get("/profile", logincheck, (request, response) => {
  response.render("profile", {
    user: request.user,
    csrfToken: request.csrfToken(),
    success: request.flash("success"),
    error: request.flash("error"),
  });
});

app.put("/profile/changepassword", logincheck, async (request, response) => {
  try {
    const user = await User.findOne({ where: { id: request.user.id } });
    bcrypt.compare(
      request.body.oldpassword,
      user.password,
      async function (err, result) {
        if (result) {
          const hash = await bcrypt.hash(request.body.newpassword, saltRounds);
          await User.update(
            { password: hash },
            {
              where: {
                id: request.user.id,
              },
            },
          );
          if (request.accepts("html")) {
            request.flash("success", "Password changed successfully");
            return response.redirect("/profile");
          } else {
            response.status(200).json({
              message: "Password changed successfully",
            });
          }
        } else {
          if (request.accepts("html")) {
            request.flash("error", "Invalid Password");
            return response.redirect("/profile");
          } else {
            response.status(400).json({
              message: "Invalid Password",
            });
          }
        }
      },
    );
  } catch (error) {
    console.error("Error in changepassword", error);
    request.flash("error", "Error in changepassword");
    response.redirect("/profile");
  }
});

app.get("/", logincheck, (request, response) => {
  response.redirect("/login");
});

// Exporting the app
module.exports = app;
