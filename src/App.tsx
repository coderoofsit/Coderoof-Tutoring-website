import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import AuthSelector from "./pages/AuthSelector";
import AdminAuth from "./pages/AdminAuth";
import StudentAuth from "./pages/StudentAuth";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/auth" element={<AuthSelector />} />
          <Route path="/auth/admin" element={<AdminAuth />} />
          <Route path="/auth/student" element={<StudentAuth />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/student" element={<StudentPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
