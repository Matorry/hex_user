import { UserUpdateDTO } from "../domain/dto/UserUpdateDTO";
import { Hasher } from "../domain/ports/Hasher";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { Email } from "../domain/value-objects/Email";

export class UpdateUser {
  constructor(
    private readonly repository: UserRepository,
    private readonly hasher: Hasher
  ) { }

  async execute(id: string, dto: UserUpdateDTO): Promise<User> {
    const userActual = await this.repository.getById(id);
    if (!userActual) throw new Error("Usuario no encontrado");

    const userName = dto.userName ?? userActual.userName;
    const email = dto.email ? new Email(dto.email) : userActual.email;
    const pswd = dto.pswd
      ? await this.hasher.hash(dto.pswd)
      : userActual.pswd.getValue();

    const updatedUser = User.fromPrimitives({
      id,
      userName,
      email: email.getValue(),
      pswd,
    });

    return this.repository.update(updatedUser);
  }
}
