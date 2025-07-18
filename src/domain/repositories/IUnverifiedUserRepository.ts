import { UnverifiedUser } from "../entities/UnverifiedUser";


export interface IUnverifiedUserRepository {
  findByEmail(email: string): Promise<UnverifiedUser | null>;

  findById(id: string): Promise<UnverifiedUser | null>;

  create(data: UnverifiedUser): Promise<UnverifiedUser>;

  updateOrCreate(data: UnverifiedUser): Promise<UnverifiedUser>;

  deleteByEmail(email: string): Promise<void>;
}