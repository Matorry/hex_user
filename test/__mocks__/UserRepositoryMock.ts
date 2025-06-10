import { UserRepository } from "../../src/user/domain/UserRepository";

export const createUserRepositoryMock = (): jest.Mocked<UserRepository> => ({
  save: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  search: jest.fn(),
  update: jest.fn(),
  findByEmail: jest.fn()
});