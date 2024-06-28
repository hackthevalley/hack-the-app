/* eslint-disable @typescript-eslint/no-unused-vars */
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";

import { AuthProvider } from "./components/Authentication";
// import routes from "./routes";
import Scanner from "./pages/Scanner";
import Login from "./pages/Login";

const theme = extendTheme({
  config: {
    initialColorMode: "system",
    useSystemColorMode: true,
  },
  styles: {
    global: {
      "html, body, #root": {
        height: "100%",
        maxHeight: "100vh",
        overflow: "hidden",
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <Router>
          <Routes>
            {/* {routes.map(({ label, icon, ...routeProps }) => (
              <Route {...routeProps} key={routeProps.path + routeProps.exact} />
            ))} */}
            <Route path="/" element={<Scanner />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster />
    </ChakraProvider>
  );
}

export default App;
