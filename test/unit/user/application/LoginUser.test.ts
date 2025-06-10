import { LoginUser } from "../../../../src/user/application/LoginUser";
import { UserLoginDTO } from "../../../../src/user/domain/dto/UserLoginDTO";
import { User } from "../../../../src/user/domain/User";
import { Email } from "../../../../src/user/domain/value-objects/Email";
import { createAuthServiceMock } from "../../../__mocks__/AuthServiceMock";
import { createBcryptServiceMock } from "../../../__mocks__/BcryptServiceMock";
import { createUserRepositoryMock } from "../../../__mocks__/UserRepositoryMock";

describe("Given the LoginUser use case", () => {
  const mockRepo = createUserRepositoryMock();
  const hasherMock = createBcryptServiceMock();
  const authServiceMock = createAuthServiceMock();
  const useCase = new LoginUser(mockRepo, authServiceMock, hasherMock);

  const dto: UserLoginDTO = {
    email: "foo@foo.a",
    pswd: "123456"
  };

  const user: User = User.fromPrimitives({
    id: "123",
    userName: "foo",
    email: "foo@foo.a",
    pswd: "123456",
  });

  describe("When valid credentials are provided", () => {
    test("Then it should return a signed token", async () => {
      mockRepo.findByEmail.mockResolvedValueOnce(user);
      hasherMock.compare.mockResolvedValueOnce(true);
      authServiceMock.sign.mockReturnValueOnce("signed-token");

      const result = await useCase.execute(dto);

      expect(mockRepo.findByEmail).toHaveBeenCalledWith(new Email(dto.email));
      expect(hasherMock.compare).toHaveBeenCalledWith(dto.pswd, user.pswd.getValue());
      expect(authServiceMock.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email.getValue(),
        userName: user.userName
      });
      expect(result).toEqual({ token: "signed-token" });
    });
  });

  describe("When the user does not exist", () => {
    test("Then it should throw an invalid credentials error", async () => {
      mockRepo.findByEmail.mockResolvedValueOnce(null);

      await expect(useCase.execute(dto)).rejects.toThrow("Credenciales inválidas");
    });
  });

  describe("When the password is incorrect", () => {
    test("Then it should throw an invalid credentials error", async () => {
      mockRepo.findByEmail.mockResolvedValueOnce(user);
      hasherMock.compare.mockResolvedValueOnce(false);

      await expect(useCase.execute(dto)).rejects.toThrow("Credenciales inválidas");
    });
  });
});
