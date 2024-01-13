const {
  enrollment,
  Course,
  Chapter,
  Pagecontent,
  Page,
  coursestatus,
} = require("../models");

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

    //finding faculty name and enrolledcount of each course

    for (const element of enrolledcourses) {
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

    //sorting enrolledcourses based on enrolledcount
    enrolledcourses.sort((a, b) => {
      return b.enrolledcount - a.enrolledcount;
    });

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
      status: true,
    });
    if (request.accepts("html")) {
      request.flash("success", "Course enrolled successfully");
      if (request.user.role == "student") {
        return response.redirect("/student");
      } else {
        return response.redirect("/educator");
      }
    } else {
      response.status(200).json({
        message: "Course enrolled successfully",
      });
    }
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

const getenrolledcourse = async (request, response) => {
  try {
    if (!request.params.courseid) {
      return response.render("error", { message: "course id not found" });
    }

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

    let totalchapters = coursechapters.length;
    let completedchapters = 0;
    let totalpages = 0;
    let completedpages = 0;

    const promises = coursechapters.map(async (element) => {
      const pages = await Page.findAll({
        where: {
          chapterId: element.id,
        },
        order: [["pageNumber", "ASC"]],
      });

      let chapterstatus = true;

      for (const page of pages) {
        totalpages++;

        try {
          const data = await coursestatus.findOne({
            where: {
              pageId: page.id,
              userId: request.user.id,
            },
          });

          if (data === null) {
            chapterstatus = false;
          } else {
            completedpages++;
          }
        } catch (error) {
          console.error("Error checking enrollment:", error.message);
        }
      }

      if (chapterstatus) {
        element.completed = true;
        completedchapters++;
      } else {
        element.completed = false;
      }
    });

    await Promise.all(promises);

    response.render("enrolledcourse", {
      course,
      coursechapters,
      totalchapters,
      completedchapters,
      totalpages,
      completedpages,
    });
  } catch (error) {
    console.error("Error in getenrolledcourse:", error.message);
    response.render("error", {
      message: "Error in getenrolledcourse" + error.message,
    });
  }
};

const getchapter = async (request, response) => {
  try {
    if (!request.params.chapterid) {
      return response.render("error", { message: "chapter id not found" });
    }

    const chapter = await Chapter.findOne({
      where: {
        id: request.params.chapterid,
      },
    });

    let courseid = chapter.courseId;

    const pages = await models.Page.findAll({
      where: {
        chapterId: request.params.chapterid,
      },
      order: [["pageNumber", "ASC"]],
    });

    for (const page of pages) {
      try {
        const data = await coursestatus.findOne({
          where: {
            pageId: page.id,
            userId: request.user.id,
          },
        });

        page.completed = data !== null;
      } catch (error) {
        console.error("Error checking enrollment:", error.message);
      }
    }

    response.render("chapter", { chapter, pages, courseid });
  } catch (error) {
    console.error("Error in getchapter:", error.message);
    response.render("error", {
      message: "Error in getchapter" + error.message,
    });
  }
};

const getpagecontent = async (request, response) => {
  const chapterid = request.params.chapterid;

  let courseId = await Chapter.findOne({
    where: {
      id: chapterid,
    },
  });

  let courseid = courseId.courseId;
  if (!request.params.pageid) {
    return response.render("error", { message: "page id not found" });
  }

  try {
    const page = await models.Page.findOne({
      where: {
        id: request.params.pageid,
      },
    });

    //finding pagecontent of page

    const pagecontent = await Pagecontent.findAll({
      where: {
        pageId: request.params.pageid,
      },
      order: [["sectionNumber", "ASC"]],
    });

    const coursestatusdata = await coursestatus.findOne({
      where: {
        pageId: request.params.pageid,
        userId: request.user.id,
      },
    });

    let status;

    if (coursestatusdata != null && coursestatusdata.status === true) {
      status = "true";
    } else {
      status = "false";
    }
    response.render("page", { page, pagecontent, status, chapterid, courseid });
  } catch (error) {
    response.render("error", { message: "Error in getpagecontent" + error });
  }
};

const markascompleted = async (request, response) => {
  if (!request.params.pageid) {
    return response.render("error", { message: "page id not found" });
  }

  //finding chapter of page
  try {
    const page = await Page.findOne({
      where: {
        id: request.params.pageid,
      },
    });

    const chapter = await Chapter.findOne({
      where: {
        id: page.chapterId,
      },
    });

    //adding enrollment status  in the tabl
    await coursestatus.create({
      userId: request.user.id,
      courseId: chapter.courseId,
      pageId: request.params.pageid,
      status: true,
    });

    if (request.accepts("html")) {
      request.flash("success", "Course marked as completed successfully");
      return response.redirect(
        "/student/chapterpages/" +
          chapter.id +
          "/" +
          request.params.pageid +
          "/true",
      );
    } else {
      response.status(201).json({
        message: "Course marked as completed successfully",
      });
    }
  } catch (error) {
    response.render("error", {
      message: "Error in markascompleted" + error + "done",
    });
  }
};
module.exports = {
  getstudent,
  enrollcourse,
  previewcourse,
  getenrolledcourse,
  getchapter,
  getpagecontent,
  markascompleted,
};
