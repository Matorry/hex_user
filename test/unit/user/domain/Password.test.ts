import { Password } from "../../../../src/user/domain/value-objects/Password";

describe("Given the Password value object", () => {
  describe("When fromHashed is called with a valid hashed password", () => {
    test("Then it should create a Password instance", () => {
      const hashed = "$2b$10$somehashedvalue123456789";
      const password = Password.fromHashed(hashed);

      expect(password).toBeInstanceOf(Password);
      expect(password.getValue()).toBe(hashed);
    });
  });

  describe("When getValue is called", () => {
    test("Then it should return the hashed password", () => {
      const hashed = "$2b$10$anotherhashvalue987654321";
      const password = Password.fromHashed(hashed);

      expect(password.getValue()).toBe(hashed);
    });
  });
});
