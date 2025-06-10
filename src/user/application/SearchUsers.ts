import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class SearchUsers {
  constructor(private readonly repository: UserRepository) { }

  async execute(search?: string): Promise<User[]> {
    return this.repository.search(search);
  }
}
