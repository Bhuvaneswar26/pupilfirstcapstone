const { Course } = require("../models");
const geteducator = (request, response) => {
  response.render("educatorhome");
};

const getcreatecourse = (request, response) => {
  return response.render("createcourse", {
    csrfToken: request.csrfToken(),
    error: request.flash("error"),
  });
};

const postcreatecourse = async (request, response) => {
  if (!request.body.coursename) {
    request.flash("error", "Please enter the course name");
    return response.redirect("/educator/createcourse");
  }
  if (!request.body.coursedescription) {
    request.flash("error", "Please enter the course description");
    return response.redirect("/educator/createcourse");
  }

  try {
    await Course.create({
      courseName: request.body.coursename,
      description: request.body.coursedescription,
      facultyId: request.user.id,
    })
      .then((course) => {
        console.log(course);
        return response.redirect("educator/editcourse/" + course.id);
      })
      .catch((error) => {
        request.flash("error", error.message);
        return response.redirect("/educator/createcourse");
      });
  } catch (error) {
    request.flash("error", error.message);
    return response.redirect("/educator/createcourse");
  }
};

module.exports = { geteducator, getcreatecourse, postcreatecourse };
