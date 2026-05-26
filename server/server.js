import express from "express";
import cors from "cors";
import portfolioRoutes from "./routes/portfolio.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/portfolio", portfolioRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});