import { PrismaClient } from "@prisma/client";
import { User } from "../../../src/user/domain/User";
import { Email } from "../../../src/user/domain/value-objects/Email";
import { UserRepositoryPostgreSQLPrisma } from "../../../src/user/infrastructure/UserRepositoryPostgreSQLPrisma";

const prisma = new PrismaClient();

describe("Given the UserRepositoryPostgreSQLPrisma integration", () => {
  const repo = new UserRepositoryPostgreSQLPrisma();

  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("When save is called", () => {
    test("Then it should persist a new user", async () => {
      const user = User.fromPrimitives({
        id: "",
        userName: "Save Test",
        email: "save@example.com",
        pswd: "hashed-password",
      });

      const created = await repo.save(user);

      expect(created.id).toBeDefined();
      expect(created.email.getValue()).toBe("save@example.com");
    });
  });

  describe("When getById is called", () => {
    test("Then it should retrieve the user by ID", async () => {
      const user = await repo.save(
        User.fromPrimitives({
          id: "",
          userName: "GetById",
          email: "getbyid@example.com",
          pswd: "hashed",
        })
      );

      const found = await repo.getById(user.id);
      expect(found?.id).toBe(user.id);
    });
  });

  describe("When update is called", () => {
    test("Then it should update user fields", async () => {
      const original = await repo.save(
        User.fromPrimitives({
          id: "",
          userName: "Original",
          email: "original@example.com",
          pswd: "pass",
        })
      );

      const updated = await repo.update(
        User.fromPrimitives({
          id: original.id,
          userName: "Updated",
          email: "updated@example.com",
          pswd: "newpass",
        })
      );

      expect(updated.userName).toBe("Updated");
      expect(updated.email.getValue()).toBe("updated@example.com");
    });
  });

  describe("When delete is called", () => {
    test("Then it should remove the user", async () => {
      const user = await repo.save(
        User.fromPrimitives({
          id: "",
          userName: "ToDelete",
          email: "delete@example.com",
          pswd: "pass",
        })
      );

      await repo.delete(user.id);
      const found = await repo.getById(user.id);
      expect(found).toBeNull();
    });
  });

  describe("When search is called with criteria", () => {
    test("Then it should return matching users", async () => {
      await repo.save(
        User.fromPrimitives({
          id: "",
          userName: "SearchUser",
          email: "search@example.com",
          pswd: "pass",
        })
      );

      const results = await repo.search("SearchUser");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].userName).toContain("SearchUser");
    });
  });

  describe("When search is called with no parameters", () => {
    test("Then it should return all users", async () => {
      await repo.save(
        User.fromPrimitives({
          id: "",
          userName: "John",
          email: "john@example.com",
          pswd: "hashed",
        })
      );
      const result = await repo.search();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("When findByEmail is called", () => {
    test("Then it should return the user with that email", async () => {
      const user = await repo.save(
        User.fromPrimitives({
          id: "",
          userName: "FindEmail",
          email: "findme@example.com",
          pswd: "pass",
        })
      );

      const found = await repo.findByEmail(new Email("findme@example.com"));
      expect(found?.id).toBe(user.id);
    });
  });

  describe("When findByEmail is called with an unknown email", () => {
    test("Then it should return null", async () => {
      const result = await repo.findByEmail(new Email("notfound@example.com"));
      expect(result).toBeNull();
    });
  });
});
