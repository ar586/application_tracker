import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./components/Toast";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
