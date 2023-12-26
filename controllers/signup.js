const User = require("../models").User;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getsignup = (request, response) => {
  response.render("signup", { csrfToken: request.csrfToken() });
};

const postsignup = async (request, response) => {
  console.log("test controller");
  console.log(request.body);

  if (!request.body.email) {
    request.flash("error", "Email is required");
    return response.render("signup", { error: request.flash("error") });
  }
  if (!request.body.password) {
    request.flash("error", "Password is required");
    return response.render("signup", { error: request.flash("error") });
  }
  if (!request.body.firstname) {
    request.flash("error", "First Name is required");
    return response.render("signup", { error: request.flash("error") });
  }
  if (!request.body.role) {
    request.flash("error", "Role is required");
    return response.render("signup", { error: request.flash("error") });
  }

  try {
    let hashedPassword;
    await bcrypt.hash(
      request.body.password,
      saltRounds,
      async function (err, hash) {
        if (hash) {
          hashedPassword = hash;
          await User.create({
            firstName: request.body.firstname,
            lastName: request.body.lastname,
            email: request.body.email,
            password: hashedPassword,
            role: request.body.role,
          });
          response.redirect("/login");
        } else {
          request.flash("error", "Password is required");
          return response.render("signup", { error: request.flash("error") });
        }
      },
    );
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      const errorMessages = err.errors.map((error) => error.message);
      request.flash("error", errorMessages);
      return response.render("signup", { error: request.flash("error") });
    } else if (err.name === "SequelizeUniqueConstraintError") {
      request.flash("error", "User Already Exists");
      return response.render("signup", { error: request.flash("error") });
    } else {
      console.error(err);
      request.flash("error", "An unexpected error occurred");
      return response.render("signup", { error: request.flash("error") });
    }
  }
};

module.exports = { getsignup, postsignup };
