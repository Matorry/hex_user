import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class GetUser {
  constructor(private readonly repository: UserRepository) { }

  async execute(id: string): Promise<User | null> {
    return this.repository.getById(id);
  }
}
