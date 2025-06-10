import { CreateUser } from "../../../../src/user/application/CreateUser";
import { UserCreateDTO } from "../../../../src/user/domain/dto/UserCreateDTO";
import { User } from "../../../../src/user/domain/User";
import { createBcryptServiceMock } from "../../../__mocks__/BcryptServiceMock";
import { createUserEventBusMock } from "../../../__mocks__/UserEventBusMock";
import { createUserRepositoryMock } from "../../../__mocks__/UserRepositoryMock";

describe("Given the use case CreateUser", () => {
  const mockRepo = createUserRepositoryMock();
  const eventBusMock = createUserEventBusMock();
  const hasherMock = createBcryptServiceMock();
  const useCase = new CreateUser(mockRepo, eventBusMock, hasherMock);

  describe("When execute is called with valid data", () => {
    test("Then it should hash the password, save the user, and publish an event", async () => {
      const dto: UserCreateDTO = {
        email: "foo@foo.a",
        userName: "foo",
        pswd: "123456",
      };

      const hashedPassword = "hashedPassword";

      const expectedUser = User.fromPrimitives({
        id: "123",
        userName: dto.userName,
        email: dto.email,
        pswd: hashedPassword,
      });

      hasherMock.hash.mockResolvedValueOnce(hashedPassword);
      mockRepo.save.mockResolvedValueOnce(expectedUser);
      eventBusMock.publish.mockResolvedValueOnce(undefined);

      const result = await useCase.execute(dto);

      expect(hasherMock.hash).toHaveBeenCalledWith(dto.pswd);

      // Verificar instancia User y sus propiedades
      expect(mockRepo.save).toHaveBeenCalledWith(expect.any(User));
      const savedUser = mockRepo.save.mock.calls[0][0];

      expect(savedUser.userName).toBe(dto.userName);
      expect(savedUser.email.getValue()).toBe(dto.email);
      expect(savedUser.pswd.getValue()).toBe(hashedPassword);

      expect(eventBusMock.publish).toHaveBeenCalledWith({
        type: "USER_CREATED",
        data: {
          id: expectedUser.id,
          email: expectedUser.email.getValue(),
          userName: expectedUser.userName,
        },
      });

      expect(result).toEqual(expectedUser);
    });
  });

  describe("When execute is called with invalid data", () => {
    test("Then it should throw an error if the email is invalid", async () => {
      const invalidDto: UserCreateDTO = {
        email: "not-an-email",
        userName: "foo",
        pswd: "123456",
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow("Email inválido");
    });

    test("Then it should throw an error if the password is too short", async () => {
      const invalidDto: UserCreateDTO = {
        email: "foo@foo.a",
        userName: "foo",
        pswd: "123",
      };

      hasherMock.hash.mockResolvedValueOnce("123"); // opcional: simular hashing

      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });
  });
});
