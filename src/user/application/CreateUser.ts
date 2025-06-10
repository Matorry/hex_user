import { UserCreateDTO } from "../domain/dto/UserCreateDTO";
import { Hasher } from "../domain/ports/Hasher";
import { User } from "../domain/User";
import { UserEventBus } from "../domain/UserEventBus";
import { UserRepository } from "../domain/UserRepository";
import { Email } from "../domain/value-objects/Email";

export class CreateUser {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventBus: UserEventBus,
    private readonly hasher: Hasher
  ) { }

  async execute(dto: UserCreateDTO): Promise<User> {
    const email = new Email(dto.email);

    const userToInsert = await User.create(dto.userName, email, dto.pswd, this.hasher);

    const savedUser = await this.repository.save(userToInsert);

    await this.eventBus.publish({
      type: "USER_CREATED",
      data: {
        id: savedUser.id,
        email: savedUser.email.getValue(),
        userName: savedUser.userName
      }
    });

    return savedUser;
  }

}

