import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { SpeedInsights } from "@vercel/speed-insights/react";

const root = document.getElementById("root");
if (root) {
    createRoot(root).render(
        <>
            <App />
            <SpeedInsights />
        </>
    );
}