const iseducator = (req, res, next) => {
  if (req.user && req.user.role === "educator") {
    return next();
  } else {
    const message =
      "You don't have permission to access this page as an educator.";
    return res.status(403).render("error", { message });
  }
};

const isstudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    return next();
  } else {
    const message =
      "You don't have permission to access this page as an student.";
    return res.status(403).render("error", { message });
  }
};

const isLogedIn = (request, response, next) => {
  if (request.isAuthenticated()) {
    if (request.user.role === "educator") {
      response.redirect("/educator");
    } else {
      response.redirect("/student");
    }
  } else {
    next();
  }
};

const logincheck = (request, response, next) => {
  if (request.isAuthenticated()) {
    next();
  } else {
    response.redirect("/login");
  }
};

module.exports = { iseducator, isstudent, isLogedIn, logincheck };
