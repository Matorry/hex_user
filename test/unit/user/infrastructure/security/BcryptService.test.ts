import { BcryptService } from "../../../../../src/user/infrastructure/security/BcryptService";

describe("Given the BcryptService", () => {
  const bcryptService = new BcryptService();
  const plainPassword = "securePassword123";

  describe("When hash is called", () => {
    test("Then it should return a hashed version of the password", async () => {
      const hashed = await bcryptService.hash(plainPassword);

      expect(typeof hashed).toBe("string");
      expect(hashed).not.toBe(plainPassword);
      expect(hashed.startsWith("$2")).toBe(true);
    });
  });

  describe("When compare is called with matching plain and hashed password", () => {
    test("Then it should return true", async () => {
      const hashed = await bcryptService.hash(plainPassword);
      const result = await bcryptService.compare(plainPassword, hashed);

      expect(result).toBe(true);
    });
  });

  describe("When compare is called with mismatching plain and hashed password", () => {
    test("Then it should return false", async () => {
      const hashed = await bcryptService.hash("anotherPassword");
      const result = await bcryptService.compare(plainPassword, hashed);

      expect(result).toBe(false);
    });
  });
});
