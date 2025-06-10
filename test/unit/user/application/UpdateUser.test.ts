import { UpdateUser } from "../../../../src/user/application/UpdateUser";
import { User } from "../../../../src/user/domain/User";
import { createBcryptServiceMock } from "../../../__mocks__/BcryptServiceMock";
import { createUserRepositoryMock } from "../../../__mocks__/UserRepositoryMock";

describe("Given the UpdateUser use case", () => {
  const mockRepo = createUserRepositoryMock();
  const hasherMock = createBcryptServiceMock();
  const useCase = new UpdateUser(mockRepo, hasherMock);

  const existingUser = User.fromPrimitives({
    id: "user-id",
    userName: "Existing User",
    email: "existing@user.com",
    pswd: "existingHashedPswd",
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo.getById.mockResolvedValue(existingUser);
  });

  describe("When execute is called with valid data", () => {
    const dto = {
      email: "foo@foo.com",
      pswd: "securePassword",
      userName: "Foo",
    };
    const hashed = "hashedPassword";

    test("Then it should hash the password and update the user", async () => {
      const expectedUser = User.fromPrimitives({
        id: existingUser.id,
        userName: dto.userName,
        email: dto.email,
        pswd: hashed,
      });

      hasherMock.hash.mockResolvedValueOnce(hashed);
      mockRepo.update.mockResolvedValueOnce(expectedUser);

      const result = await useCase.execute(existingUser.id, dto);

      expect(hasherMock.hash).toHaveBeenCalledWith(dto.pswd);
      expect(mockRepo.update).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });
  });

  describe("When execute is called with missing data", () => {
    test("Then it should return previous values where data is missing", async () => {
      const partialDto = {
        email: "",
        pswd: "",
        userName: "",
      };

      mockRepo.update.mockResolvedValueOnce(existingUser);

      const result = await useCase.execute(existingUser.id, partialDto);

      expect(result.userName).toEqual(existingUser.userName);
      expect(result.email.getValue()).toEqual(existingUser.email.getValue());
      expect(result.pswd.getValue()).toEqual(existingUser.pswd.getValue());
    });
  });

  describe("When the repository fails", () => {
    test("Then it should propagate the error", async () => {
      const dto = {
        email: "foo@foo.com",
        pswd: "securePassword",
        userName: "Foo",
      };
      hasherMock.hash.mockResolvedValueOnce("hashed");
      mockRepo.update.mockRejectedValueOnce(new Error("Update failed"));

      await expect(useCase.execute(existingUser.id, dto)).rejects.toThrow("Update failed");
    });
  });
});
