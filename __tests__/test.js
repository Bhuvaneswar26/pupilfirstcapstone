/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

const cheerio = require("cheerio");

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

let server, agent;

//test to check the signup feature
describe("Test Features of Educator", () => {
  //before all test cases run, this will sync the database and start the server
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(3010, () => {
      console.log("Example app listening on port 3010!");
    });
    agent = request.agent(server);
  });

  //after all test cases run, close the server
  afterAll(async () => {
    await server.close();
  });

  //test to check the signup feature
  test("Test for Signup GET method of Educator", async () => {
    const response = await agent.get("/signup");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Sign Up");
  });

  //test to check the signup feature
  test("Test for Signup POST method of Educator", async () => {
    const csrfToken = extractCsrfToken(await agent.get("/signup"));
    const response = await agent
      .post("/signup")
      .set("Accept", "application/json")
      .send({
        firstname: "test",
        lastname: "test",
        email: "test@gmail.com",
        password: "testtesttest",
        role: "educator",
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Account succefully created");
    expect(response.body.user).toHaveProperty("firstName", "test");
    expect(response.body.user).toHaveProperty("role", "educator");
  });

  //test to check the login feature
  test("Test Login GET method of Educator", async () => {
    const response = await agent.get("/login");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Login");
  });

  //test to check the login feature
  test("Test Login POST method of Educator", async () => {
    const csrfToken = extractCsrfToken(await agent.get("/login"));
    const response = await agent
      .post("/login")
      .set("Accept", "application/json")
      .send({
        mail: "test@gmail.com",
        password: "testtesttest",
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toHaveProperty("firstName", "test");
    expect(response.body.user).toHaveProperty("role", "educator");
  });

  //test to check the Educator feature
  test("Test for Profile GET method of Educator", async () => {
    const response = await agent.get("/profile");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Profile");
  });

  //test to check the Educator password change feature
  test("Test for password change PUT method of Educator", async () => {
    const csrfToken = extractCsrfToken(await agent.get("/profile"));
    const response = await agent
      .put("/profile/changepassword")
      .set("Accept", "application/json")
      .send({
        oldpassword: "testtesttest",
        newpassword: "testtesttesttest",
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Password changed successfully");
  });

  //test to test get method of create course
  test("Test for course creation GET method of Educator", async () => {
    const response = await agent.get("/educator/createcourse");
    expect(response.statusCode).toBe(200);
  });

  //test to check the Educator course creation feature
  test("Test for course creation POST method of Educator", async () => {
    const csrfToken = extractCsrfToken(
      await agent.get("/educator/createcourse"),
    );
    const response = await agent
      .post("/educator/createcourse")
      .set("Accept", "application/json")
      .send({
        coursename: "testcourse",
        coursedescription: "testdescription",
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("course created successfully");
  });

  //test to check the Educator home after creating a course
  test("Test for Educator home GET method of Educator", async () => {
    const response = await agent
      .get("/educator")
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.yourCourses.length).toBe(1);
    expect(response.body.message).toBe("educatorhome");
  });

  //test get method of edit course
  test("Test for course edit GET method of Educator", async () => {
    const response = await agent.get("/educator/editcourse");
    expect(response.statusCode).toBe(200);
  });

  //test to get add chapter feature
  test("Test for add chapter GET method of Educator", async () => {
    const courseid = 1;
    const response = await agent.get("/educator/addchapter/" + courseid);
    expect(response.statusCode).toBe(200);
  });

  //test to check the Educator chapter creation feature
  test("Test for chapter creation POST method of Educator", async () => {
    const csrfToken = extractCsrfToken(
      await agent.get("/educator/addchapter/1"),
    );
    const response = await agent
      .post("/educator/addchapter/1")
      .set("Accept", "application/json")
      .send({
        chapternumber: 1,
        chaptername: "testchapter",
        chapterdescription: "testdescription",
        courseid: 1,
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("chapter created successfully");
    expect(response.body.chapter).toHaveProperty("chapterNumber", 1);
  });

  //test to get edit chapter feature
  test("Test for edit chapter GET method of Educator", async () => {
    const chapterid = 1;
    const response = await agent
      .get("/educator/editchapter/" + chapterid)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.chapter.id).toBe(1);
  });

  //test to check the Educator chapter edit feature
  test("Test for chapter edit PUT method of Educator", async () => {
    const csrfToken = extractCsrfToken(
      await agent.get("/educator/editchapter/1"),
    );
    const response = await agent
      .put("/educator/editchapter/1")
      .set("Accept", "application/json")
      .send({
        chapternumber: 1,
        chaptername: "testchapteredit",
        chapterdescription: "testdescription",
        courseid: 1,
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("chapter updated successfully");
    expect(response.body.updatedChapter.id).toBe(1);
    expect(response.body.updatedChapter.chapterName).toBe("testchapteredit");
  });

  //test to post add page feature
  test("Test for add page POST method of Educator", async () => {
    const csrfToken = extractCsrfToken(
      await agent.get("/educator/addchapter/1"),
    );
    const response = await agent
      .post("/educator/addpage/1")
      .set("Accept", "application/json")
      .send({
        pagename: "testpage",
        pagenumber: 1,
        chapterid: 1,
        _csrf: csrfToken,
      });
    expect(response.body.message).toBe("page created successfully");
    expect(response.statusCode).toBe(201);
    expect(response.body.page).toHaveProperty("chapterId", 1);
  });

  //test to get add content feature
  test("Test for add content GET method of Educator", async () => {
    const pageid = 1;
    const response = await agent
      .get("/educator/addcontent/" + pageid)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(201);
    expect(response.body.page.pageNumber).toBe(1);
  });

  //test to check the Educator content creation feature
  test("Test for content creation POST method of Educator", async () => {
    const csrfToken = extractCsrfToken(
      await agent.get("/educator/addcontent/1"),
    );
    const response = await agent
      .post("/educator/addcontent/1/1")
      .set("Accept", "application/json")
      .send({
        content: "testcontent",
        contenttype: "text",
        pageid: 1,
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("content added successfully");
  });
});

describe("Test Features of Student", () => {
  //before all test cases run, this will sync the database and start the server
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(3010, () => {
      console.log("Example app listening on port 3010!");
    });
    agent = request.agent(server);
  });

  //after all test cases run, close the server
  afterAll(async () => {
    await server.close();
  });

  //test to check the signup feature
  test("Test for Signup GET method of Student", async () => {
    const response = await agent.get("/signup");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Sign Up");
  });

  //test to check the signup feature
  test("Test for Signup POST method of Student", async () => {
    const csrfToken = extractCsrfToken(await agent.get("/signup"));
    const response = await agent
      .post("/signup")
      .set("Accept", "application/json")
      .send({
        firstname: "test",
        lastname: "test",
        email: "test@gmail.com",
        password: "testtesttest",
        role: "student",
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Account succefully created");
    expect(response.body.user).toHaveProperty("firstName", "test");
    expect(response.body.user).toHaveProperty("role", "student");
  });

  //test to check the login feature
  test("Test Login GET method of Student", async () => {
    const response = await agent.get("/login");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Login");
  });

  //test to check the login feature
  test("Test Login POST method of Student", async () => {
    const csrfToken = extractCsrfToken(await agent.get("/login"));
    const response = await agent
      .post("/login")
      .set("Accept", "application/json")
      .send({
        mail: "test@gmail.com",
        password: "testtesttest",
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toHaveProperty("firstName", "test");
    expect(response.body.user).toHaveProperty("role", "student");
  });

  test("Test for Profile GET method of Student", async () => {
    const response = await agent.get("/profile");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Profile");
  });

  //test to check the Educator password change feature
  test("Test for password change PUT method of Studentr", async () => {
    const csrfToken = extractCsrfToken(await agent.get("/profile"));
    const response = await agent
      .put("/profile/changepassword")
      .set("Accept", "application/json")
      .send({
        oldpassword: "testtesttest",
        newpassword: "testtesttesttest",
        _csrf: csrfToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Password changed successfully");
  });

  //test student home
  test("Test for Student home GET method of Student", async () => {
    const response = await agent
      .get("/student")
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
  });

  test("Test enroll course POST method of Student", async () => {
    const csrfToken = extractCsrfToken(await agent.get("/student"));
    const response = await agent.get("/student/enroll/1").send({
      courseid: 1,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(200);
  });
});
