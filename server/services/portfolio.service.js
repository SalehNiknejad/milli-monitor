import fs from "fs-extra";
import path from "path";

const DB_PATH = path.resolve("server/data/portfolio.json");

export const getPortfolio = async () => {
  return fs.readJson(DB_PATH);
};

export const savePortfolio = async (data) => {
  await fs.writeJson(DB_PATH, data, {
    spaces: 2,
  });

  return data;
};