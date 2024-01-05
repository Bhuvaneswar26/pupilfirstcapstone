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
describe("Test the signup path", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(3010, () => {
      console.log("Example app listening on port 3010!");
    });
    agent = request.agent(server);
  });

  afterAll(async () => {
    await server.close();
  });

  test("Test for Signup GET method", async () => {
    const response = await agent.get("/signup");
    expect(response.statusCode).toBe(200);
  });

  test("Test for Signup POST method", async () => {
    const csrfToken = extractCsrfToken(await agent.get("/signup"));
    const response = await agent.post("/signup").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      password: "testtesttest",
      role: "educator",
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });
});

describe("Test the login path", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(3010, () => {
      console.log("Example app listening on port 3010!");
    });
    agent = request.agent(server);
  });

  afterAll(async () => {
    await server.close();
  });

  test("Test for Login GET method", async () => {
    const response = await agent.get("/login");
    expect(response.statusCode).toBe(200);
  });

  test("Test for Login POST method", async () => {
    //first send the signup request
    let csrfToken1 = extractCsrfToken(await agent.get("/signup"));
    await agent.post("/signup").send({
      firstname: "test",
      lastname: "test",
      email: "test@gmail.com",
      password: "testtest",
      role: "educator",
      _csrf: csrfToken1,
    });

    let csrfToken2 = extractCsrfToken(await agent.get("/login"));
    const response = await agent.post("/login").send({
      email: "test@gmail.com",
      password: "testtest",
      _csrf: csrfToken2,
    });
    expect(response.statusCode).toBe(302);
  });
});

describe;
