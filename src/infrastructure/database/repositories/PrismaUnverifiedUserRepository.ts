import { UnverifiedUser } from "../../../domain/entities/UnverifiedUser";
import { IUnverifiedUserRepository } from "../../../domain/repositories/IUnverifiedUserRepository";
import { PrismaClient, unverified_users as PrismaUnverifiedUser } from "../../../../generated/prisma";


const prisma = new PrismaClient();

function toUnverifiedUserEntity(prismaUser: PrismaUnverifiedUser): UnverifiedUser {
  return new UnverifiedUser({
    id: prismaUser.id,
    email: prismaUser.email,
    firstName: prismaUser.firstName ?? undefined,
    lastName: prismaUser.lastName ?? undefined,
    trialToActivate: prismaUser.trialToActivate ?? undefined,
    formType: prismaUser.formType ?? undefined,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt
  });
}


export class PrismaUnverifiedUserRepository implements IUnverifiedUserRepository {
  async findByEmail(email: string): Promise<UnverifiedUser | null> {
    const unverifiedUserRow = await prisma.unverified_users.findUnique({where: {email}});

    return unverifiedUserRow ? toUnverifiedUserEntity(unverifiedUserRow) : null;
  }

  async findById(id: string): Promise<UnverifiedUser | null> {
    const unverifiedUserRow = await prisma.unverified_users.findUnique({where: {id}});

    return unverifiedUserRow ? toUnverifiedUserEntity(unverifiedUserRow) : null;
  }

  async create(data: UnverifiedUser): Promise<UnverifiedUser> {
    const unverifiedUserRow = await prisma.unverified_users.create({data});

    return toUnverifiedUserEntity(unverifiedUserRow);
  }

  async updateOrCreate(data: UnverifiedUser): Promise<UnverifiedUser> {
    const unverifiedUserRow = await prisma.unverified_users.upsert({
      where: {email: data.email},
      update: {...data},
      create: {...data}
    });

    return toUnverifiedUserEntity(unverifiedUserRow);
  }

  async deleteByEmail(email: string): Promise<void> {
    await prisma.unverified_users.delete({where: {email}});
  }
}