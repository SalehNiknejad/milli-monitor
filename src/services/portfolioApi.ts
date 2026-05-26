const API_URL = "http://localhost:3001/api/portfolio";

export const portfolioApi = {
  async getPortfolio() {
    const response = await fetch(API_URL);

    return response.json();
  },

  async addTransaction(transaction: any) {
    await fetch(`${API_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
  },

  async updateWallet(walletBalance: number) {
    await fetch(`${API_URL}/wallet`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletBalance,
      }),
    });
  },
};
