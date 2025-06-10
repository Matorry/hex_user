import { PrismaClient } from "@prisma/client";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { Email } from "../domain/value-objects/Email";

const prisma = new PrismaClient();

export class UserRepositoryPostgreSQLPrisma implements UserRepository {
  constructor() { }

  async save(user: User): Promise<User> {
    const data = user.getSafeData();
    const pswd = user.pswd.getValue();

    const saved = await prisma.user.create({
      data: {
        userName: data.userName,
        email: data.email,
        pswd: pswd
      }
    });

    return User.fromPrimitives(saved);
  }

  async search(search?: string): Promise<User[]> {
    const results = await prisma.user.findMany({
      where: search
        ? {
          OR: [
            { userName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } }
          ]
        }
        : {}
    });

    return results.map(User.fromPrimitives);
  }

  async getById(id: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { id } });
    return found ? User.fromPrimitives(found) : null;
  }

  async update(user: User): Promise<User> {
    const data = user.getSafeData();
    const pswd = user.pswd.getValue();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        userName: data.userName,
        email: data.email,
        pswd: pswd
      }
    });

    return User.fromPrimitives(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const found = await prisma.user.findUnique({
      where: { email: email.getValue() }
    });

    return found ? User.fromPrimitives(found) : null;
  }
}
