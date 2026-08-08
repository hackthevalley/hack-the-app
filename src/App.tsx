import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "next-themes";

import { ChakraProvider } from "@chakra-ui/react";

import { AuthProvider, RequireAuth } from "./components/Authentication";
import Scanner from "./pages/Scanner";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { appSystem } from "./theme";

function App() {
  return (
    <ChakraProvider value={appSystem}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Scanner />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default App;
