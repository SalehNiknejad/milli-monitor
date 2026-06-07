import express from "express";
import cors from "cors";
import portfolioRoutes from "./routes/portfolio.routes.js";

const USDT_API_URL = "https://apiv2.nobitex.ir/market/stats?srcCurrency=usdt";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/usdt", async (_req, res) => {
  try {
    const response = await fetch(USDT_API_URL, {
      method: "GET",
      headers: {
        accept: "application/json",
        "accept-language": "en-GB,en;q=0.9,fa-IR;q=0.8,fa;q=0.7,en-US;q=0.6",
        origin: "https://nobitex.ir",
        referer: "https://nobitex.ir/",
        "content-type": "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(`Nobitex request failed with ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("USDT proxy error:", error);
    res.status(502).json({ error: "Unable to reach Nobitex API" });
  }
});

app.use("/api/portfolio", portfolioRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});