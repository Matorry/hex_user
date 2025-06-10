import { Hasher } from "../../src/user/domain/ports/Hasher";

export const createBcryptServiceMock = (): jest.Mocked<Hasher> => ({
  hash: jest.fn(),
  compare: jest.fn()
});