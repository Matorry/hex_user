import { User } from "./User";
import { Email } from "./value-objects/Email";

export interface UserRepository {
  save(user: Omit<User, "id">): Promise<User>;
  getById(id: string): Promise<User | null>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  search(search?: string): Promise<User[]>;
  findByEmail(email: Email): Promise<User | null>;
}
