import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.warn("Service Worker registration failed:", error);
      });
  });
}
