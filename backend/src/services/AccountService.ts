import { type Account } from "@prisma/client";
import { AccountRepository } from "../repositories/AccountRepository.js";

export type CreateAccountInput = {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	address?: string;
	city?: string;
	state?: string;
	country?: string;
};

export class AccountService {
	private readonly accountRepository: AccountRepository;

	constructor(accountRepository: AccountRepository) {
		this.accountRepository = accountRepository;
	}

	async createAccount(input: CreateAccountInput): Promise<Account> {
		const firstName = input.firstName?.trim();
		const lastName = input.lastName?.trim();
		const email = input.email?.trim().toLowerCase();

		if (!firstName) {
			throw new Error("firstName is required");
		}
		if (!lastName) {
			throw new Error("lastName is required");
		}
		if (!email) {
			throw new Error("email is required");
		}

		const existing = await this.accountRepository.findByEmail(email);
		if (existing) {
			throw new Error("Account with this email already exists");
		}

		return await this.accountRepository.create({
			firstName,
			lastName,
			email,
			phoneNumber: input.phoneNumber ?? null,
			address: input.address ?? null,
			city: input.city ?? null,
			state: input.state ?? null,
			country: input.country ?? null,
		});
	}

	async getAccounts(): Promise<Account[]> {
		return await this.accountRepository.findAll();
	}

	async getAccountById(id: string): Promise<Account> {
		if (!id) {
			throw new Error("id is required");
		}
		const account = await this.accountRepository.findById(id);
		if (!account) {
			throw new Error("Account not found");
		}
		return account;
	}

	async updateAccount(
		id: string,
		input: Partial<CreateAccountInput>
	): Promise<Account> {
		if (!id) {
			throw new Error("id is required");
		}

		// Ensure exists
		const existingAccount = await this.accountRepository.findById(id);
		if (!existingAccount) {
			throw new Error("Account not found");
		}

		const updateData: any = {};
		if (typeof input.firstName === "string") updateData.firstName = input.firstName.trim();
		if (typeof input.lastName === "string") updateData.lastName = input.lastName.trim();
		if (typeof input.email === "string") updateData.email = input.email.trim().toLowerCase();
		if (typeof input.phoneNumber === "string") updateData.phoneNumber = input.phoneNumber;
		if (typeof input.address === "string") updateData.address = input.address;
		if (typeof input.city === "string") updateData.city = input.city;
		if (typeof input.state === "string") updateData.state = input.state;
		if (typeof input.country === "string") updateData.country = input.country;

		if (updateData.email && updateData.email !== existingAccount.email) {
			const other = await this.accountRepository.findByEmail(updateData.email);
			if (other && other.id !== id) {
				throw new Error("Account with this email already exists");
			}
		}

		return await this.accountRepository.update(id, updateData);
	}

	async deleteAccount(id: string): Promise<Account> {
		if (!id) {
			throw new Error("id is required");
		}
		// Ensure exists for consistent error
		const existing = await this.accountRepository.findById(id);
		if (!existing) {
			throw new Error("Account not found");
		}
		return await this.accountRepository.delete(id);
	}
}

export default AccountService;


