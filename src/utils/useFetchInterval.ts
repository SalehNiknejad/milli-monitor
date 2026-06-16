import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

export const FetchInterval = flag({
  key: "FetchInterval",
  adapter: vercelAdapter(),
  defaultValue: 30000,
});
