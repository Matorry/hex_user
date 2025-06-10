import { GetUser } from "../../../../src/user/application/GetUser";
import { User } from "../../../../src/user/domain/User";
import { createUserRepositoryMock } from "../../../__mocks__/UserRepositoryMock";

describe("Given the GetUser use case", () => {
  let mockRepo: ReturnType<typeof createUserRepositoryMock>;
  let useCase: GetUser;

  beforeEach(() => {
    mockRepo = createUserRepositoryMock();
    useCase = new GetUser(mockRepo);
  });

  describe("When execute is called with a valid user ID", () => {
    const validUserId = "12345";
    const expectedUser: User = User.fromPrimitives({
      id: "123",
      userName: "foo",
      email: "foo@foo.a",
      pswd: "hashedPassword",
    });

    test("Then it should call the repository to getById the user", async () => {
      mockRepo.getById.mockResolvedValueOnce(expectedUser);

      await expect(useCase.execute(validUserId)).resolves.toBe(expectedUser);
      expect(mockRepo.getById).toHaveBeenCalledTimes(1);
      expect(mockRepo.getById).toHaveBeenCalledWith(validUserId);
    });
  });

  describe("When execute is called with an invalid user ID", () => {
    const invalidUserId = "-";

    test("Then it should throw an error indicating the user was not found", async () => {
      mockRepo.getById.mockRejectedValueOnce(new Error("User not found"));

      await expect(useCase.execute(invalidUserId)).rejects.toThrow(
        "User not found"
      );
      expect(mockRepo.getById).toHaveBeenCalledTimes(1);
      expect(mockRepo.getById).toHaveBeenCalledWith(invalidUserId);
    });
  });
});
