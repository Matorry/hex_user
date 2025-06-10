import { SearchUsers } from "../../../../src/user/application/SearchUsers";
import { User } from "../../../../src/user/domain/User";
import { createUserRepositoryMock } from "../../../__mocks__/UserRepositoryMock";

describe("Given the GetUser use case", () => {
  let mockRepo: ReturnType<typeof createUserRepositoryMock>;
  let useCase: SearchUsers;

  beforeEach(() => {
    mockRepo = createUserRepositoryMock();
    useCase = new SearchUsers(mockRepo);
  });

  describe("When execute is called with a valid user name", () => {
    const validUserName = "foo";
    const expectedUser: User = User.fromPrimitives({
      id: "123",
      userName: "foo",
      email: "foo@foo.a",
      pswd: "hashedPassword",
    });

    test("Then it should call the repository to getById the user", async () => {
      mockRepo.search.mockResolvedValueOnce([expectedUser]);

      await expect(useCase.execute(validUserName)).resolves.toStrictEqual([
        expectedUser,
      ]);
      expect(mockRepo.search).toHaveBeenCalledTimes(1);
      expect(mockRepo.search).toHaveBeenCalledWith(validUserName);
    });
  });

  describe("When execute is called with no parameters", () => {
    const expectedUser: User = User.fromPrimitives({
      id: "123",
      userName: "foo",
      email: "foo@foo.a",
      pswd: "hashedPassword",
    });

    test("Then it should return all users or default list", async () => {
      mockRepo.search.mockResolvedValueOnce([expectedUser]);

      await expect(useCase.execute()).resolves.toEqual([expectedUser]);
      expect(mockRepo.search).toHaveBeenCalledTimes(1);
      expect(mockRepo.search).toHaveBeenCalledWith(undefined);
    });
  });

  describe("When execute is called with an invalid user name", () => {
    const invalidUserName = "-";

    test("Then it should throw an error indicating the user was not found", async () => {
      mockRepo.search.mockRejectedValueOnce(new Error("User not found"));

      await expect(useCase.execute(invalidUserName)).rejects.toThrow(
        "User not found"
      );
      expect(mockRepo.search).toHaveBeenCalledTimes(1);
      expect(mockRepo.search).toHaveBeenCalledWith(invalidUserName);
    });
  });
});
