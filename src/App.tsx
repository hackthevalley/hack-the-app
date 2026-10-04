import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "next-themes";

import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";

import { AuthProvider, RequireAuth } from "./components/Authentication";
import NotFound from "./pages/NotFound";
import { appSystem } from "./theme";

const Scanner = lazy(() => import("./pages/Scanner"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

function App() {
  return (
    <ChakraProvider value={appSystem}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Router>
            <Suspense
              fallback={
                <Center minH="100svh">
                  <Spinner size="lg" colorPalette="blue" />
                </Center>
              }
            >
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
            </Suspense>
          </Router>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default App;
