import { UserRepository } from "../domain/UserRepository";

export class DeleteUser {
  constructor(private readonly repository: UserRepository) { }

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
