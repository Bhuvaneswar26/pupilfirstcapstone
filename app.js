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
const methodOverride = require("method-override");
const saltRounds = 10;

//importing models
const { User } = require("./models");
const Sequelize = require("sequelize");

//LOGIN SECURITY MIDDLEWARE
const {
  iseducator,
  isstudent,
  isLogedIn,
  logincheck,
} = require("./middleware.js");

//Routes importing
const signup = require("./routes/signup");
const educator = require("./routes/educator");
const student = require("./routes/student");

//creating the app server
const app = express();

// ejs view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//setting up the static files
app.use(express.static(path.join(__dirname, "public")));

//using flash
app.use(flash());

//midllware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser("ssh some key!"));
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

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
passport.deserializeUser(async (id, done) => {
  await User.findByPk(id)
    .then((user) => {
      console.log(user);
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

//csrf token setup
const csrfProtection = csrf("123456789iamasecret987654321look", [
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
]);
app.use(csrfProtection);

//defining the routes
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
    if (request.user.role === "educator") {
      response.redirect("/educator");
    } else {
      response.redirect("/student");
    }
  },
);

app.use("/signup", csrfProtection, isLogedIn, signup);
app.use("/educator", csrfProtection, logincheck, iseducator, educator);
app.use("/student", logincheck, isstudent, student);
app.get("/signout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      // Handle the error
      return next(err);
    }
    res.redirect("/login"); // Redirect after logout
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
          request.flash("success", "Password changed successfully");
          response.redirect("/profile");
        } else {
          request.flash("error", "Invalid Password");
          response.redirect("/profile");
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

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal Server Error" + err);
});

//exporting the app
module.exports = app;
