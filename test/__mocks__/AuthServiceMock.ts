import { AuthService } from "../../src/user/domain/ports/AuthService";

export const createAuthServiceMock = (): jest.Mocked<AuthService> => ({
  sign: jest.fn(),
  verify: jest.fn()
});
