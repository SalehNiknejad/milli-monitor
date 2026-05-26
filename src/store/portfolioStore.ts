import { portfolioApi } from "../services/portfolioApi";
import { create } from "zustand";
import {
  normalizeTransactionFee,
  type ParsedTransaction,
} from "../utils/transactionParser";

type Transaction = ParsedTransaction;

interface PortfolioState {
  walletBalance: number;
  goldBalance: number;
  transactions: Transaction[];

  fetchPortfolio: () => Promise<void>;

  addTransaction: (transaction: Transaction) => Promise<void>;

  importTransactions: (transactions: Transaction[]) => Promise<void>;

  updateWallet: (walletBalance: number) => Promise<void>;
}

const calculateBalances = (transactions: Transaction[]) => {
  const lastTx = [...transactions]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .at(-1);

  return {
    walletBalance: lastTx?.walletAfter ?? 0,
    goldBalance: lastTx?.milliBalance ?? 0,
  };
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  walletBalance: 0,
  goldBalance: 0,
  transactions: [],

  fetchPortfolio: async () => {
    const data = await portfolioApi.getPortfolio();

    const transactions = data.transactions.map(normalizeTransactionFee);
    const balances = calculateBalances(transactions);

    set({
      ...data,
      transactions,
      ...balances,
    });
  },

  addTransaction: async (transaction) => {
    await portfolioApi.addTransaction(transaction);

    set((state) => {
      const updated = [...state.transactions, transaction];
      const balances = calculateBalances(updated);

      return {
        transactions: updated,
        ...balances,
      };
    });
  },

  importTransactions: async (transactions) => {
    for (const transaction of transactions) {
      await portfolioApi.addTransaction(transaction);
    }

    set((state) => {
      const updated = [...state.transactions, ...transactions];
      const balances = calculateBalances(updated);

      return {
        transactions: updated,
        ...balances,
      };
    });
  },

  updateWallet: async (walletBalance) => {
    await portfolioApi.updateWallet(walletBalance);

    set({
      walletBalance,
    });
  },
}));
