import request from "supertest";
import { createApp } from "../../../src/app";

let app;
let userId = "";

beforeAll(async () => {
  app = await createApp();
});

afterAll(async () => {
  if (userId) {
    await request(app).delete(`/users/${userId}`);
  }
});

describe("[Integration] /auth/login route", () => {
  const email = "login@example.com";
  const password = "password123";

  beforeAll(async () => {
    const res = await request(app).post("/users").send({
      userName: "Login Tester",
      email,
      pswd: password,
    });
    userId = res.body.id;
  });

  test("Given valid credentials, When POST /auth/login is called, Then it should return a JWT token", async () => {
    const response = await request(app).post("/auth/login").send({ email, pswd: password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("Given invalid credentials, When POST /auth/login is called, Then it should return 401", async () => {
    const response = await request(app).post("/auth/login").send({ email, pswd: "wrong" });

    expect(response.status).toBe(401);
  });

  test("Given non-existent user, When POST /auth/login is called, Then it should return 401", async () => {
    const response = await request(app).post("/auth/login").send({ email: "no@user.com", pswd: "password123" });

    expect(response.status).toBe(401);
  });
});
