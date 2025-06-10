import bcrypt from "bcrypt";
import { Hasher } from "../../domain/ports/Hasher";

export class BcryptService implements Hasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
