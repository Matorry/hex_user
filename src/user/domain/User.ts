import { Hasher } from "./ports/Hasher";
import { Email } from "./value-objects/Email";
import { Password } from "./value-objects/Password";

export class User {
  private constructor(
    public readonly id: string,
    public readonly userName: string,
    public readonly email: Email,
    public readonly pswd: Password
  ) { }

  static async create(
    userName: string,
    email: Email,
    plainPassword: string,
    hasher: Hasher
  ): Promise<User> {
    const hashed = await hasher.hash(plainPassword);
    const password = Password.fromHashed(hashed);
    return new User("", userName, email, password);
  }

  static fromPrimitives(obj: {
    id: string;
    userName: string;
    email: string;
    pswd: string;
  }): User {
    return new User(
      obj.id,
      obj.userName,
      new Email(obj.email),
      Password.fromHashed(obj.pswd)
    );
  }

  getSafeData() {
    return {
      id: this.id,
      userName: this.userName,
      email: this.email.getValue(),
    };
  }

}
