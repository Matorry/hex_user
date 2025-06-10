import { DeleteUser } from "../../../../src/user/application/DeleteUser";
import { createUserRepositoryMock } from "../../../__mocks__/UserRepositoryMock";

describe("Given the DeleteUser use case", () => {
  let mockRepo: ReturnType<typeof createUserRepositoryMock>;
  let useCase: DeleteUser;

  beforeEach(() => {
    mockRepo = createUserRepositoryMock();
    useCase = new DeleteUser(mockRepo);
  });

  describe("When execute is called with a valid user ID", () => {
    const validUserId = "12345";

    test("Then it should call the repository to delete the user", async () => {
      mockRepo.delete.mockResolvedValueOnce(undefined);

      await expect(useCase.execute(validUserId)).resolves.toBeUndefined();
      expect(mockRepo.delete).toHaveBeenCalledTimes(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(validUserId);
    });
  });

  describe("When execute is called with an invalid user ID", () => {
    const invalidUserId = "-";

    test("Then it should throw an error indicating the user was not found", async () => {
      mockRepo.delete.mockRejectedValueOnce(new Error("User not found"));

      await expect(useCase.execute(invalidUserId)).rejects.toThrow("User not found");
      expect(mockRepo.delete).toHaveBeenCalledTimes(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(invalidUserId);
    });
  });
});
