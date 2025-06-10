import request from "supertest";
import { createApp } from "../../../src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let app;
let createdUserId = "";

beforeAll(async () => {
  app = await createApp();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("[Integration] /users routes", () => {
  describe("Given a valid user", () => {
    test("When POST /users is called, Then it should create the user", async () => {
      const response = await request(app).post("/users").send({
        userName: "Test User",
        email: "test.user@example.com",
        pswd: "password123"
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toMatchObject({
        userName: "Test User",
        email: "test.user@example.com"
      });

      createdUserId = response.body.id;
    });

    test("When GET /users is called, Then it should return all users", async () => {
      const response = await request(app).get("/users");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some(u => u.id === createdUserId)).toBe(true);
    });

    test("When GET /users/:id is called, Then it should return the specific user", async () => {
      const response = await request(app).get(`/users/${createdUserId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", createdUserId);
    });

    test("When PUT /users/:id is called, Then it should update the user", async () => {
      const response = await request(app).put(`/users/${createdUserId}`).send({
        userName: "Updated User",
        email: "updated@example.com"
      });
      expect(response.status).toBe(200);
      expect(response.body.userName).toBe("Updated User");
      expect(response.body.email).toBe("updated@example.com");
    });

    test("When DELETE /users/:id is called, Then it should delete the user", async () => {
      const response = await request(app).delete(`/users/${createdUserId}`);
      expect(response.status).toBe(204);
    });

    test("When GET /users/:id is called after deletion, Then it should return 404", async () => {
      const response = await request(app).get(`/users/${createdUserId}`);
      expect(response.status).toBe(404);
    });
  });
});
