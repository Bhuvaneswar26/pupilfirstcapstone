const { Course, Chapter, Page, Pagecontent } = require("../models");
const Sequelize = require("sequelize");
console.log("hii", Chapter);
const geteducator = async (request, response) => {
  try {
    const yourCourses = await Course.findAll({
      where: {
        facultyId: request.user.id,
      },
    });

    const otherCourses = await Course.findAll({
      where: {
        facultyId: {
          [Sequelize.Op.not]: request.user.id,
        },
      },
    });
    response.render("educatorhome", {
      error: request.flash("error"),
      yourCourses,
      otherCourses,
      success: request.flash("success"),
      name: request.user.firstName,
    });
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
        console.log("hhiii", course);
        return response.redirect("addchapter/" + course.id);
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
  console.log("hii", course, request.params.courseid);
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
  console.log(existingChapters);
  return response.render("addchapter", {
    csrfToken: request.csrfToken(),
    course,
    existingChapters,
    error: request.flash("error"),
  });
};

const postaddchapter = async (request, response) => {
  if (!request.params.courseid) {
    request.flash("error", "courseid dosent exists");
    return response.redirect("/educator/createcourse");
  }
  if (!request.body.chaptername) {
    request.flash("error", "please enter chaptername");
    return response.redirect("/educator/addchapter/" + request.params.courseid);
  }
  if (request.body.chapternumber && isNaN(request.body.chapternumber)) {
    request.flash("error", "chapternumber should be a nummber");
    return response.redirect("/educator/addchapter/" + request.params.courseid);
  }
  if (!request.body.chapternumber) {
    request.flash("error", "please enter chapternumber");
    return response.redirect("/educator/addchapter/" + request.params.courseid);
  }
  if (!request.body.chapterdescription) {
    request.flash("error", "please enter description");
    return response.redirect("/educator/addchapter/" + request.params.courseid);
  }

  try {
    await Chapter.create({
      chapterName: request.body.chaptername,
      chapterNumber: request.body.chapternumber,
      description: request.body.chapterdescription,
      courseId: request.params.courseid,
    })
      .then((chapter) => {
        console.log("created", chapter);
        return response.redirect("/educator/editchapter/" + chapter.id);
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
      console.log(pages);
      return response.render("editchapter", {
        csrfToken: request.csrfToken(),
        chapter,
        pages,
        error: request.flash("error"),
      });
    })
    .catch((error) => {
      request.flash("error", error.message);
      return response
        .status(404)
        .render("error", { message: "chapter not found" });
    });
};

const patcheditchapter = async (request, response) => {
  console.log("hiii", request.params.chapterid);

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
        returning: true, // This option is necessary to get the updated record
        plain: true, // This option ensures only the updated record is returned
      },
    );

    console.log("updated", updatedChapter);

    if (updatedChapter[1]) {
      // The second element of the result array indicates the number of rows affected (1 for success)
      return response.redirect(
        "/educator/editchapter/" + request.params.chapterid,
      );
    } else {
      // If no rows were affected, it means the chapter with the given id was not found
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
        console.log("created", page);
        return response.redirect(
          "/educator/editchapter/" + request.params.chapterid,
        );
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
      console.log(pagecontents);
      return response.render("addcontent", {
        csrfToken: request.csrfToken(),
        page,
        pagecontents,
        error: request.flash("error"),
      });
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

      return response.redirect("/educator/addcontent/" + request.params.pageid);
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
        returning: true, // This option is necessary to get the updated record
        plain: true, // This option ensures only the updated record is returned
      },
    );

    console.log("updated", updatedPagecontent);

    if (updatedPagecontent[1]) {
      // The second element of the result array indicates the number of rows affected (1 for success)
      return response.redirect("/educator/addcontent/" + request.params.pageid);
    } else {
      // If no rows were affected, it means the chapter with the given id was not found
      throw new Error("Pagecontent not found");
    }
  } catch (error) {
    console.error("update failed", error);
    request.flash("error", error.message);
    return response.redirect("/educator/addcontent/" + request.params.pageid);
  }
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
};
