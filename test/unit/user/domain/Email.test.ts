import { Email } from "../../../../src/user/domain/value-objects/Email";

describe("Given the Email value object", () => {
  describe("When constructed with a valid email", () => {
    test("Then it should create an Email instance", () => {
      const value = "test@example.com";
      const email = new Email(value);

      expect(email).toBeInstanceOf(Email);
      expect(email.getValue()).toBe(value);
    });
  });

  describe("When constructed with an invalid email", () => {
    test("Then it should throw an error", () => {
      const invalidEmail = "not-an-email";

      expect(() => new Email(invalidEmail)).toThrow("Email inválido");
    });
  });

  describe("When getValue is called", () => {
    test("Then it should return the original email string", () => {
      const value = "user@mail.com";
      const email = new Email(value);

      expect(email.getValue()).toBe(value);
    });
  });
});
