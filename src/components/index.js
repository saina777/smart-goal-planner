import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ No curly braces
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
