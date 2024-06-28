// import { defineConfig } from "vite";

// export default defineConfig({
//   define: {
//     "import.meta.env.VITE_NODE_ENV": JSON.stringify(
//       process.env.VITE_NODE_ENV || "development"
//     ),
//     DEV_IGNORE_AUTH: process.env.VITE_NODE_ENV === "production" ? false : true,
//   },
// });

export const DEV_IGNORE_AUTH = import.meta.env.VITE_NODE_ENV !== "production";
