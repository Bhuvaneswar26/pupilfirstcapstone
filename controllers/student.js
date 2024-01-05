const { enrollment, Course, Chapter } = require("../models");

const models = require("../models");

const getstudent = async (request, response) => {
  try {
    let enrolledcourses;
    try {
      enrolledcourses = await enrollment.findAll({
        where: { userId: request.user.id },
        include: [
          {
            model: Course,
          },
        ],
      });

      enrolledcourses = enrolledcourses.map((enrollment) => enrollment.Course);
    } catch (error) {
      response.redirect("/student");
    }

    const allcourses = await Course.findAll();

    let notenrolledcourses = [];

    for (const element of allcourses) {
      try {
        const data = await enrollment.findOne({
          where: { userId: request.user.id, courseId: element.id },
        });

        if (data === null) {
          notenrolledcourses.push(element);
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
      }
    }

    for (const element of notenrolledcourses) {
      try {
        const data = await enrollment.findAll({
          where: { courseId: element.id },
        });

        const user = await models.User.findOne({
          where: { id: element.facultyId },
        });

        element.facultyName = user.firstName;

        let enrolledcount = data.length;

        element.enrolledcount = enrolledcount;
      } catch (error) {
        console.error("Error checking enrollment:", error);
      }
    }

    //sorting notenrolledcourses based on enrolledcount
    notenrolledcourses.sort((a, b) => {
      return b.enrolledcount - a.enrolledcount;
    });

    return response.render("studenthome", {
      enrolledcourses,
      name: request.user.firstName,
      notenrolledcourses,
    });
  } catch (error) {
    response.render("studenthome", {
      enrolledcourses: [],
      name: request.user.firstName,
      notenrolledcourses: [],
    });
  }
};

const enrollcourse = async (request, response) => {
  if (!request.params.courseid) {
    return response.render("error", { message: "course id not found" });
  }

  try {
    await enrollment.create({
      userId: request.user.id,
      courseId: request.params.courseid,
    });
    response.redirect("/student");
  } catch (error) {
    response.render("error", { message: "Error in enrollcourse" });
  }
};

const previewcourse = async (request, response) => {
  if (!request.params.courseid) {
    return response.render("error", { message: "course id not found" });
  }

  try {
    const course = await Course.findOne({
      where: {
        id: request.params.courseid,
      },
    });

    const coursechapters = await Chapter.findAll({
      where: {
        courseId: request.params.courseid,
      },
      order: [["chapterNumber", "ASC"]],
    });
    response.render("previewcourse", { course, coursechapters });
  } catch (error) {
    response.render("error", { message: "Error in previewcourse" });
  }
};

module.exports = { getstudent, enrollcourse, previewcourse };
