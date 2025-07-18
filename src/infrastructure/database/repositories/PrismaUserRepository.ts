import { PrismaClient } from "../../../../generated/prisma";
import { users as PrismaUser } from "../../../../generated/prisma";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";


const prisma = new PrismaClient();

function toUserEntity(prismaUser: PrismaUser): User {
  return new User({
    id: prismaUser.id,
    email: prismaUser.email,
    password: prismaUser.password ?? "",
    firstName: prismaUser.firstName ?? undefined,
    lastName: prismaUser.lastName ?? undefined,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt
  });
}

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.users.findUnique({where: {email}});

    return user ? toUserEntity(user) : null;
  }

  async create(user: User): Promise<User> {
    const created = await prisma.users.create({
      data: {
        ...user
      }
    });

    return toUserEntity(created);
  }

  async createOrUpdate(data: User): Promise<User> {
    const user = await prisma.users.upsert({
      where: {email: data.email},
      create: {...data},
      update: {...data}
    });

    return toUserEntity(user);
  }
}