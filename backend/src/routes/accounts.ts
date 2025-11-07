import { Router, type Request, type Response, type NextFunction } from "express";
import { AccountRepository } from "../repositories/AccountRepository.js";
import AccountService from "../services/AccountService.js";
import { getPrismaClient } from "../prisma.js";

const router = Router();

const prisma = getPrismaClient();
const accountRepository = new AccountRepository(prisma);
const accountService = new AccountService(accountRepository);

function mapErrorStatus(err: any): any {
  const message = String(err?.message || "");
  if (message.includes("not found")) {
    err.status = 404;
  } else if (
    message.includes("required") ||
    message.includes("already exists")
  ) {
    err.status = 400;
  }
  return err;
}

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await accountService.getAccounts();
    res.json(accounts);
  } catch (err) {
    next(mapErrorStatus(err));
  }
});

router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const account = await accountService.getAccountById(req.params.id);
      res.json(account);
    } catch (err) {
      next(mapErrorStatus(err));
    }
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = await accountService.createAccount(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(mapErrorStatus(err));
  }
});

router.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const updated = await accountService.updateAccount(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(mapErrorStatus(err));
    }
  }
);

router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await accountService.deleteAccount(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(mapErrorStatus(err));
    }
  }
);

export default router;


