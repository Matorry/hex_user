import { UserCreateSchema, UserUpdateSchema } from "../../../../../src/user/infrastructure/validators/UserValidator";

describe("Given the UserCreateSchema", () => {
  const validData = {
    userName: "JohnDoe",
    email: "john@example.com",
    pswd: "strongPassword"
  };

  describe("When valid data is provided", () => {
    test("Then it should pass validation without errors", () => {
      const result = UserCreateSchema.validate(validData);
      expect(result.error).toBeUndefined();
    });
  });

  describe("When required fields are missing", () => {
    test("Then it should return a validation error", () => {
      const result = UserCreateSchema.validate({});
      expect(result.error).toBeDefined();
    });
  });

  describe("When email is in an invalid format", () => {
    test("Then it should return a validation error", () => {
      const result = UserCreateSchema.validate({
        ...validData,
        email: "not-an-email"
      });
      expect(result.error).toBeDefined();
    });
  });

  describe("When password is too short", () => {
    test("Then it should return a validation error", () => {
      const result = UserCreateSchema.validate({
        ...validData,
        pswd: "123"
      });
      expect(result.error).toBeDefined();
    });
  });
});

describe("Given the UserUpdateSchema", () => {
  describe("When only one valid optional field is provided", () => {
    test("Then it should pass validation", () => {
      const result = UserUpdateSchema.validate({ userName: "Jane" });
      expect(result.error).toBeUndefined();
    });
  });

  describe("When no fields are provided", () => {
    test("Then it should pass validation (since all fields are optional)", () => {
      const result = UserUpdateSchema.validate({});
      expect(result.error).toBeUndefined();
    });
  });

  describe("When email format is invalid", () => {
    test("Then it should return a validation error", () => {
      const result = UserUpdateSchema.validate({ email: "bad-email" });
      expect(result.error).toBeDefined();
    });
  });

  describe("When password is too short", () => {
    test("Then it should return a validation error", () => {
      const result = UserUpdateSchema.validate({ pswd: "123" });
      expect(result.error).toBeDefined();
    });
  });
});
