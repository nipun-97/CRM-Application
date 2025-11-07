import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import accountsRouter from "./routes/accounts.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/accounts", accountsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 TypeScript Backend is running!");
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? "Internal Server Error";
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
