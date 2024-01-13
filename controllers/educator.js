const {
  User,
  Course,
  Chapter,
  Page,
  Pagecontent,
  enrollment,
  coursestatus,
} = require("../models");
const Sequelize = require("sequelize");
const geteducator = async (request, response) => {
  try {
    const yourCourses = await Course.findAll({
      where: {
        facultyId: request.user.id,
      },
    });

    await Promise.all(
      yourCourses.map(async (course) => {
        const enrollnumber = await enrollment.findAll({
          where: {
            courseId: course.id,
          },
        });

        course.enrollments = enrollnumber.length;
      }),
    );

    const otherCourses = await Course.findAll({
      where: {
        facultyId: {
          [Sequelize.Op.not]: request.user.id,
        },
      },
    });

    await Promise.all(
      otherCourses.map(async (course) => {
        const enrollnumber = await enrollment.findAll({
          where: {
            courseId: course.id,
          },
        });
        course.enrollments = enrollnumber.length;

        const faculty = await User.findOne({
          where: {
            id: course.facultyId,
          },
        });
        course.instructor = faculty.firstName;
      }),
    );

    //sorting enrolledcourses based on enrolledcount
    yourCourses.sort((a, b) => {
      return b.enrollments - a.enrollments;
    });

    otherCourses.sort((a, b) => {
      return b.enrollments - a.enrollments;
    });

    if (request.accepts("html")) {
      return response.render("educatorhome", {
        error: request.flash("error"),
        yourCourses,
        otherCourses,
        success: request.flash("success"),
        name: request.user.firstName,
      });
    } else {
      response.status(200).json({
        yourCourses,
        otherCourses,
        message: "educatorhome",
      });
    }
  } catch (error) {
    request.flash("error", error.message);
    return response.redirect("/educator");
  }
};

const getcreatecourse = (request, response) => {
  return response.render("createcourse", {
    csrfToken: request.csrfToken(),
    error: request.flash("error"),
  });
};

//controoler for creating course
const postcreatecourse = async (request, response) => {
  if (!request.body.coursename) {
    if (request.accepts("html")) {
      request.flash("error", "Please enter the course name");
      return response.redirect("/educator/createcourse");
    } else {
      response.status(400).json({
        message: "Please enter the course name",
      });
    }
  }
  if (!request.body.coursedescription) {
    if (request.accepts("html")) {
      request.flash("error", "Please enter the course description");
      return response.redirect("/educator/createcourse");
    } else {
      response.status(400).json({
        message: "Please enter the course description",
      });
    }
  }

  try {
    await Course.create({
      courseName: request.body.coursename,
      description: request.body.coursedescription,
      facultyId: request.user.id,
    })
      .then((course) => {
        if (request.accepts("html")) {
          return response.redirect("addchapter/" + course.id);
        } else {
          return response.status(201).json({
            course,
            message: "course created successfully",
          });
        }
      })
      .catch((error) => {
        if (request.accepts("html")) {
          request.flash("error", error.message);
          return response.redirect("/educator/createcourse");
        } else {
          return response.status(400).json({
            message: error.message,
          });
        }
      });
  } catch (error) {
    if (request.accepts("html")) {
      request.flash("error", error.message);
      return response.redirect("/educator/createcourse");
    } else {
      response.status(400).json({
        message: error.message,
      });
    }
  }
};

const geteditcourse = async (request, response) => {
  const courses = await Course.findAll({
    where: {
      facultyId: request.user.id,
    },
  });
  console.log(courses);
  return response.render("editcourse", {
    courses,
    error: request.flash("error"),
  });
};

const getaddchapter = async (request, response) => {
  const course = await Course.findByPk(request.params.courseid);
  if (!course) {
    return response
      .status(404)
      .render("error", { message: "Course not found" });
  }
  if (course.facultyId !== request.user.id) {
    return response.status(403).render("error", {
      message: "You don't have permission to edit this course",
    });
  }

  const existingChapters = await Chapter.findAll({
    where: {
      courseId: course.id,
    },
  });

  return response.render("addchapter", {
    csrfToken: request.csrfToken(),
    course,
    existingChapters,
    error: request.flash("error"),
  });
};

const postaddchapter = async (request, response) => {
  if (!request.params.courseid) {
    if (request.accepts("html")) {
      request.flash("error", "courseid dosent exists");
      return response.redirect("/educator/createcourse");
    } else {
      response.status(400).json({
        message: "courseid dosent exists",
      });
    }
  }
  if (!request.body.chaptername) {
    if (request.accepts("html")) {
      request.flash("error", "please enter chaptername");
      return response.redirect(
        "/educator/addchapter/" + request.params.courseid,
      );
    } else {
      response.status(400).json({
        message: "please enter chaptername",
      });
    }
  }
  if (request.body.chapternumber && isNaN(request.body.chapternumber)) {
    if (request.accepts("html")) {
      request.flash("error", "chapternumber should be a nummber");
      return response.redirect(
        "/educator/addchapter/" + request.params.courseid,
      );
    } else {
      response.status(400).json({
        message: "chapternumber should be a nummber",
      });
    }
  }
  if (!request.body.chapternumber) {
    if (request.accepts("html")) {
      request.flash("error", "please enter chapternumber");
      return response.redirect(
        "/educator/addchapter/" + request.params.courseid,
      );
    } else {
      response.status(400).json({
        message: "please enter chapternumber",
      });
    }
  }
  if (!request.body.chapterdescription) {
    if (request.accepts("html")) {
      request.flash("error", "please enter description");
      return response.redirect(
        "/educator/addchapter/" + request.params.courseid,
      );
    } else {
      response.status(400).json({
        message: "please enter description",
      });
    }
  }

  try {
    await Chapter.create({
      chapterName: request.body.chaptername,
      chapterNumber: request.body.chapternumber,
      description: request.body.chapterdescription,
      courseId: request.params.courseid,
    })
      .then((chapter) => {
        if (request.accepts("html")) {
          return response.redirect("/educator/editchapter/" + chapter.id);
        } else {
          return response.status(201).json({
            chapter,
            message: "chapter created successfully",
          });
        }
      })
      .catch((error) => {
        if (request.accepts("html")) {
          request.flash("error", error.message);
          return response.redirect("editcourse/" + request.courseid);
        } else {
          return response.status(400).json({
            message: error.message,
          });
        }
      });
  } catch (error) {
    if (request.accepts("html")) {
      request.flash("error", error.message);
      return response.redirect("editcourse/" + request.courseid);
    } else {
      return response.status(400).json({
        message: error.message,
      });
    }
  }
};

const geteditchapter = async (request, response) => {
  const chapter = await Chapter.findByPk(request.params.chapterid);
  if (!chapter) {
    return response
      .status(404)
      .render("error", { message: "chapter not found" });
  }
  await Page.findAll({
    where: {
      chapterId: request.params.chapterid,
    },
  })
    .then((pages) => {
      if (request.accepts("html")) {
        return response.render("editchapter", {
          csrfToken: request.csrfToken(),
          chapter,
          pages,
          error: request.flash("error"),
        });
      } else {
        return response.status(200).json({
          chapter,
          pages,
          message: "editchapter",
        });
      }
    })
    .catch((error) => {
      request.flash("error", error.message);
      return response
        .status(404)
        .render("error", { message: "chapter not found" });
    });
};

const patcheditchapter = async (request, response) => {
  if (!request.params.chapterid) {
    request.flash("error", "chapterid dosent exists");
    return response.redirect("/educator/createcourse");
  }
  if (!request.body.chaptername) {
    request.flash("error", "please enter chaptername");
    return response.redirect(
      "/educator/addchapter/" + request.params.chapterid,
    );
  }
  if (!request.body.chapternumber) {
    request.flash("error", "please enter chapternumber");
    return response.redirect(
      "/educator/addchapter/" + request.params.chapterid,
    );
  }
  if (!request.body.chapterdescription) {
    request.flash("error", "please enter description");
    return response.redirect(
      "/educator/addchapter/" + request.params.chapterid,
    );
  }

  try {
    const updatedChapter = await Chapter.update(
      {
        chapterName: request.body.chaptername,
        chapterNumber: request.body.chapternumber,
        description: request.body.chapterdescription,
        courseId: request.params.chapterid,
      },
      {
        where: {
          id: request.params.chapterid,
        },
        returning: true,
        plain: true,
      },
    );

    if (updatedChapter[1]) {
      if (request.accepts("html")) {
        return response.redirect(
          "/educator/editchapter/" + request.params.chapterid,
        );
      } else {
        console.log("updated", updatedChapter[1]);
        return response.status(200).json({
          updatedChapter: updatedChapter[1],
          message: "chapter updated successfully",
        });
      }
    } else {
      throw new Error("Chapter not found");
    }
  } catch (error) {
    console.error("update failed", error);
    request.flash("error", error.message);
    return response.redirect("/editcourse/" + request.courseid);
  }
};

const postaddpage = async (request, response) => {
  if (!request.params.chapterid) {
    request.flash("error", "chapterid dosent exists");
    return response.redirect("/educator/createcourse");
  }
  if (!request.body.pagename) {
    request.flash("error", "please enter pagename");
    return response.redirect(
      "/educator/addchapter/" + request.params.chapterid,
    );
  }
  if (!request.body.pagenumber) {
    request.flash("error", "please enter pagenumber");
    return response.redirect(
      "/educator/addchapter/" + request.params.chapterid,
    );
  }

  try {
    await Page.create({
      pageName: request.body.pagename,
      pageNumber: request.body.pagenumber,
      chapterId: request.params.chapterid,
    })
      .then((page) => {
        if (request.accepts("html")) {
          return response.redirect("/educator/addcontent/" + page.id);
        } else {
          return response
            .status(201)
            .json({ page, message: "page created successfully" });
        }
      })
      .catch((error) => {
        console.log("created", error);
        request.flash("error", error.message);
        return response.redirect("editcourse/" + request.courseid);
      });
  } catch (error) {
    request.flash("error", error.message);
    return response.redirect("editcourse/" + request.courseid);
  }
};

const getaddcontent = async (request, response) => {
  const page = await Page.findByPk(request.params.pageid);
  if (!page) {
    return response.status(404).render("error", { message: "page not found" });
  }
  await Pagecontent.findAll({
    where: {
      pageId: request.params.pageid,
    },
    order: [["sectionNumber", "ASC"]],
  })
    .then((pagecontents) => {
      if (request.accepts("html")) {
        return response.render("addcontent", {
          csrfToken: request.csrfToken(),
          page,
          pagecontents,
          error: request.flash("error"),
        });
      } else {
        return response.status(201).json({
          page,
          pagecontents,
          message: "addcontent",
        });
      }
    })
    .catch((error) => {
      request.flash("error", error.message);
      return response
        .status(404)
        .render("error", { message: "page not found" });
    });
};

const postaddcontent = async (request, response) => {
  if (!request.params.pageid) {
    request.flash("error", "pageid dosent exists");
    return response.redirect("/educator/createcourse");
  }

  const noofinputs = request.params.noofinputs;

  if (!noofinputs) {
    request.flash("error", "no of inputs should be provided");
    return response.redirect("/educator/addcontent/" + request.params.pageid);
  } else {
    let noofexisting;
    try {
      const alreadypagecontents = await Pagecontent.findAll({
        where: {
          pageId: request.params.pageid,
        },
      });

      if (alreadypagecontents) {
        noofexisting = alreadypagecontents.length;
      } else {
        noofexisting;
      }
    } catch (err) {
      request.flash("error", err.message);
      return response.redirect("/educator/addcontent/" + request.params.pageid);
    }
    try {
      let start = Number(noofexisting) + 1;
      let end = Number(noofinputs) + Number(noofexisting) + 1;
      console.log(start, end);
      for (let i = start; i < end; i++) {
        let j = i;
        let sectionType = "sectionType" + j;
        let sectionContent = "sectionContent" + j;
        console.log(request.body[sectionType]);
        console.log(request.body[sectionContent]);
        await Pagecontent.create({
          sectionNumber: i,
          type: request.body[sectionType],
          content: request.body[sectionContent],
          pageId: request.params.pageid,
        });
      }

      if (request.accepts("html")) {
        return response.redirect(
          "/educator/addcontent/" + request.params.pageid,
        );
      } else {
        return response.status(201).json({
          message: "content added successfully",
        });
      }
    } catch (error) {
      request.flash("error", error.message);
      console.log(error.message);
      return response.redirect("/educator/addcontent/" + request.params.pageid);
    }
  }
};

const puteditcontent = async (request, response) => {
  if (!request.params.sectionid) {
    request.flash("error", "sectionid dosent exists");
    return response.redirect("/educator/createcourse");
  }
  if (!request.body.sectiontype) {
    request.flash("error", "please enter sectiontype");
    return response.redirect(
      "/educator/addchapter/" + request.params.sectionid,
    );
  }
  if (!request.body.sectioncontent) {
    request.flash("error", "please enter sectioncontent");
    return response.redirect(
      "/educator/addchapter/" + request.params.sectionid,
    );
  }

  try {
    const updatedPagecontent = await Pagecontent.update(
      {
        sectionNumber: request.body.sectionnumber,
        type: request.body.sectiontype,
        content: request.body.sectioncontent,
        pageId: request.params.pageid,
      },
      {
        where: {
          id: request.params.sectionid,
        },
        returning: true,
        plain: true,
      },
    );

    console.log("updated", updatedPagecontent);

    if (updatedPagecontent[1]) {
      return response.redirect("/educator/addcontent/" + request.params.pageid);
    } else {
      throw new Error("Pagecontent not found");
    }
  } catch (error) {
    console.error("update failed", error);
    request.flash("error", error.message);
    return response.redirect("/educator/addcontent/" + request.params.pageid);
  }
};

const getreports = async (request, response) => {
  const facultyId = request.user.id;

  const courses = await Course.findAll({
    where: {
      facultyId: facultyId,
    },
  });

  console.log(courses, "type", typeof courses);

  return response.render("reports", {
    courses,
    error: request.flash("error"),
  });
};

const getcoursereports = async (request, response) => {
  const courseId = request.params.courseid;

  const enrollments = await enrollment.findAll({
    where: {
      courseId: courseId,
    },
  });

  const students = await Promise.all(
    enrollments.map(async (enrollment) => {
      const student = await User.findByPk(enrollment.userId);
      return student;
    }),
  );

  // Finding the percentage of chapters completed

  const chapters = await Chapter.findAll({
    where: {
      courseId: courseId,
    },
  });

  const pages = await Page.findAll({
    where: {
      chapterId: chapters.map((chapter) => chapter.id),
    },
  });

  let totalpages = pages.length;

  await Promise.all(
    students.map(async (student) => {
      let completedpages = 0;

      await Promise.all(
        pages.map(async (page) => {
          const pagestatus = await coursestatus.findOne({
            where: {
              pageId: page.id,
              userId: student.id,
            },
          });

          if (pagestatus) {
            completedpages++;
          }
        }),
      );

      student.percentage = (completedpages / totalpages) * 100;
      console.log("percentage", student.percentage);
    }),
  );

  console.log(students);

  return response.render("coursereports", {
    students,
    error: request.flash("error"),
  });
};

module.exports = {
  geteducator,
  getcreatecourse,
  postcreatecourse,
  getaddchapter,
  postaddchapter,
  geteditchapter,
  patcheditchapter,
  postaddpage,
  getaddcontent,
  postaddcontent,
  puteditcontent,
  geteditcourse,
  getreports,
  getcoursereports,
};
