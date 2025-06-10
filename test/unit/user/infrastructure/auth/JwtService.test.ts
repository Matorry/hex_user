import { JwtService } from "../../../../../src/user/infrastructure/auth/JwtService";

describe("Given the JwtService", () => {
  const jwtService = new JwtService();
  const mockPayload = { id: "abc123", email: "test@example.com" };

  describe("When sign is called", () => {
    test("Then it should return a valid JWT token string", () => {
      const token = jwtService.sign(mockPayload);

      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });
  });

  describe("When verify is called with a valid token", () => {
    test("Then it should decode the token and return the payload", () => {
      const token = jwtService.sign(mockPayload);
      const decoded = jwtService.verify(token) as any;

      expect(decoded.id).toBe(mockPayload.id);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });
  });

  describe("When verify is called with an invalid token", () => {
    test("Then it should throw a JsonWebTokenError", () => {
      const invalidToken = "invalid.token.string";
      expect(() => jwtService.verify(invalidToken)).toThrow("invalid token");
    });
  });
});
