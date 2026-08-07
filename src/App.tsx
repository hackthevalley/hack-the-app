import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import { AuthProvider } from "./components/Authentication";
import Scanner from "./pages/Scanner";
import Login from "./pages/Login";

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Scanner />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default App;
