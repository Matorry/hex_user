import { UserEventBus } from "../../src/user/domain/UserEventBus";

export const createUserEventBusMock = (): jest.Mocked<UserEventBus> => ({
  publish: jest.fn()
});