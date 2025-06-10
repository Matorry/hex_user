import request from "supertest";
import { createApp } from "../../src/app";

let app;
let userId = "";

beforeAll(async () => {
  app = await createApp();
});

describe("[E2E] /users flow", () => {
  const validUser = {
    userName: "E2E User",
    email: "e2e.user@example.com",
    pswd: "e2epassword"
  };

  const invalidUser = {
    userName: "A", // demasiado corto
    email: "invalid-email",
    pswd: "123"
  };

  const updateData = {
    userName: "Updated Name",
    email: "updated@example.com",
    pswd: "updatedpass"
  };

  test("Given valid data, When POST /users, Then it should create the user", async () => {
    const res = await request(app).post("/users").send(validUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
  });

  test("Given invalid data, When POST /users, Then it should return 400", async () => {
    const res = await request(app).post("/users").send(invalidUser);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Datos inválidos");
  });

  test("Given existing user, When GET /users/:id, Then it should return the user", async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
  });

  test("Given unknown user, When GET /users/:id, Then it should return 404", async () => {
    const res = await request(app).get(`/users/unknown-id`);
    expect(res.status).toBe(404);
  });

  test("Given valid data, When PUT /users/:id, Then it should update the user", async () => {
    const res = await request(app).put(`/users/${userId}`).send(updateData);
    expect(res.status).toBe(200);
    expect(res.body.userName).toBe(updateData.userName);
  });

  test("Given invalid data, When PUT /users/:id, Then it should return 400", async () => {
    const res = await request(app).put(`/users/${userId}`).send(invalidUser);
    expect(res.status).toBe(400);
  });

  test("Given unknown user, When PUT /users/:id, Then it should return 500", async () => {
    const res = await request(app).put(`/users/non-existent-id`).send(updateData);
    expect(res.status).toBe(500);
  });

  test("Given user, When DELETE /users/:id, Then it should delete successfully", async () => {
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.status).toBe(204);
  });

  test("Given deleted user, When GET /users/:id, Then it should return 404", async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.status).toBe(404);
  });
});
