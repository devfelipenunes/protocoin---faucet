import dotenv from "dotenv";
dotenv.config();

import helmet from "helmet";
import cors from "cors";
import { mintAndTransfer } from "./Web3Provider";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";

const PORT: number = parseInt(`${process.env.PORT || 3001}`);
const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

const nextMint = new Map<string, number>();

app.post(
  "/mint/:wallet",
  async (req: Request, res: Response, next: NextFunction) => {
    const wallet = req.params.wallet;
    if (nextMint.has(wallet) && nextMint.get(wallet)! > Date.now())
      return res.status(429).json({
        err: "Please wait 24 hours before minting again",
      });

    try {
      const tx = await mintAndTransfer(wallet);
      res.json(tx);
    } catch (err) {
      res.status(500).json({
        err,
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
