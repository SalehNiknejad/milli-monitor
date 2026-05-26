import express from "express";
import {
  getPortfolio,
  savePortfolio,
} from "../services/portfolio.service.js";

const router = express.Router();

router.get("/", async (_, res) => {
  const data = await getPortfolio();

  res.json(data);
});

router.post("/transaction", async (req, res) => {
  const portfolio = await getPortfolio();

  portfolio.transactions.unshift(req.body);

  await savePortfolio(portfolio);

  res.json({
    success: true,
  });
});

router.patch("/wallet", async (req, res) => {
  const portfolio = await getPortfolio();

  portfolio.walletBalance = req.body.walletBalance;

  await savePortfolio(portfolio);

  res.json({
    success: true,
  });
});

export default router;