import { UserLoginDTO } from "../domain/dto/UserLoginDTO";
import { AuthService } from "../domain/ports/AuthService";
import { Hasher } from "../domain/ports/Hasher";
import { UserRepository } from "../domain/UserRepository";
import { Email } from "../domain/value-objects/Email";

export class LoginUser {
  constructor(
    private readonly repository: UserRepository,
    private readonly authService: AuthService,
    private readonly hasher: Hasher
  ) { }

  async execute(dto: UserLoginDTO): Promise<{ token: string }> {
    const email = new Email(dto.email);
    const user = await this.repository.findByEmail(email);

    if (!user) throw new Error("Credenciales inválidas");

    const isValid = await this.hasher.compare(dto.pswd, user.pswd.getValue());
    if (!isValid) throw new Error("Credenciales inválidas");

    const token = this.authService.sign({
      id: user.id,
      email: user.email.getValue(),
      userName: user.userName
    });

    return { token };
  }
}
