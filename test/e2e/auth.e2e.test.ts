import request from "supertest";
import { createApp } from "../../src/app";

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

describe("[E2E] /auth/login flow", () => {
  const uniqueEmail = `login.${Date.now()}@example.com`;
  const user = {
    userName: "LoginUser",
    email: uniqueEmail,
    pswd: "LoginPass123!"
  };

  const wrongPassword = {
    email: uniqueEmail,
    pswd: "WrongPass"
  };

  const nonExistent = {
    email: "ghost@example.com",
    pswd: "doesnotexist"
  };

  test("Given valid credentials, When POST /auth/login, Then it should return a token", async () => {
    const resCreate = await request(app).post("/users").send(user);
    if (resCreate.status !== 201) {
      console.error("Error creando usuario:", resCreate.body);
    }
    expect(resCreate.status).toBe(201);
    userId = resCreate.body.id;

    const resLogin = await request(app).post("/auth/login").send({
      email: user.email,
      pswd: user.pswd
    });

    expect(resLogin.status).toBe(200);
    expect(resLogin.body).toHaveProperty("token");
  });

  test("Given wrong password, When POST /auth/login, Then it should return 401", async () => {
    const res = await request(app).post("/auth/login").send(wrongPassword);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/credenciales/i);
  });

  test("Given non-existent user, When POST /auth/login, Then it should return 401", async () => {
    const res = await request(app).post("/auth/login").send(nonExistent);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/credenciales/i);
  });

  test("Given missing fields, When POST /auth/login, Then it should return 401", async () => {
    const res = await request(app).post("/auth/login").send({ email: "" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });
});
