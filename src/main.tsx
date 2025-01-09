import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import "./index.css";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SnackbarProvider
      autoHideDuration={2000}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/">
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </SnackbarProvider>
  </StrictMode>
);
