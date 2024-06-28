import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);

// Render the app.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
