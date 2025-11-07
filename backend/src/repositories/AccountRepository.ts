import { type Prisma, type PrismaClient, type Account } from "@prisma/client";

export class AccountRepository {
  private readonly prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    const createdAccount = await this.prismaClient.account.create({ data });
    return createdAccount;
  }

  async findAll(): Promise<Account[]> {
    const accounts = await this.prismaClient.account.findMany();
    return accounts;
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prismaClient.account.findUnique({ where: { id } });
    return account;
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await this.prismaClient.account.findUnique({ where: { email } });
    return account;
  }

  async update(id: string, data: Prisma.AccountUpdateInput): Promise<Account> {
    const updatedAccount = await this.prismaClient.account.update({ where: { id }, data });
    return updatedAccount;
  }

  async delete(id: string): Promise<Account> {
    const deletedAccount = await this.prismaClient.account.delete({ where: { id } });
    return deletedAccount;
  }
}

export default AccountRepository;


