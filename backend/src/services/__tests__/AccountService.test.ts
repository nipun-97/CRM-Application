import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Account } from "@prisma/client";
import { AccountService } from "../AccountService.js";
import type { AccountRepository } from "../../repositories/AccountRepository.js";

type AccountRepositoryMock = {
	create: ReturnType<typeof vi.fn>;
	findByEmail: ReturnType<typeof vi.fn>;
};

function createMockAccountRepository(): {
	mock: AccountRepositoryMock;
	repository: AccountRepository;
} {
	const mock: AccountRepositoryMock = {
		create: vi.fn(),
		findByEmail: vi.fn(),
	};

	const repository = {
		create: mock.create,
		findByEmail: mock.findByEmail,
		findAll: vi.fn(),
		findById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	} as unknown as AccountRepository;

	return { mock, repository };
}

describe("AccountService.createAccount", () => {
	let repository: AccountRepository;
	let mock: AccountRepositoryMock;
	let service: AccountService;

	beforeEach(() => {
		({ repository, mock } = createMockAccountRepository());
		service = new AccountService(repository);
		vi.clearAllMocks();
	});

	it("successfully creates a new account", async () => {
		const input = {
			firstName: " Jane ",
			lastName: "Doe",
			email: "JANE@example.com",
			phoneNumber: "123-456-7890",
		};

		const createdAccount = {
			id: "acc_1",
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			phoneNumber: "123-456-7890",
			address: null,
			city: null,
			state: null,
			country: null,
			dateCreated: new Date(),
		} as Account;

		mock.findByEmail.mockResolvedValue(null);
		mock.create.mockResolvedValue(createdAccount);

		const result = await service.createAccount(input);

		expect(mock.findByEmail).toHaveBeenCalledWith("jane@example.com");
		expect(mock.create).toHaveBeenCalledWith({
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			phoneNumber: "123-456-7890",
			address: null,
			city: null,
			state: null,
			country: null,
		});
		expect(result).toBe(createdAccount);
	});

	it("throws an error when email is already taken", async () => {
		const existingAccount = {
			id: "acc_existing",
			firstName: "Existing",
			lastName: "User",
			email: "existing@example.com",
			phoneNumber: null,
			address: null,
			city: null,
			state: null,
			country: null,
			dateCreated: new Date(),
		} as Account;

		mock.findByEmail.mockResolvedValue(existingAccount);

		await expect(
			service.createAccount({
				firstName: "New",
				lastName: "User",
				email: "existing@example.com",
			})
		).rejects.toThrowError("Account with this email already exists");

		expect(mock.create).not.toHaveBeenCalled();
	});

	it("throws an error when firstName is missing", async () => {
		await expect(
			service.createAccount({
				firstName: "   ",
				lastName: "User",
				email: "user@example.com",
			})
		).rejects.toThrowError("firstName is required");

		expect(mock.findByEmail).not.toHaveBeenCalled();
		expect(mock.create).not.toHaveBeenCalled();
	});
});


