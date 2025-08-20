import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import Shortcuts from "@/react-app/pages/Shortcuts";
import AuthCallback from "@/react-app/pages/AuthCallback";
import { LanguageProvider } from "@/react-app/hooks/useLanguage";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shortcuts" element={<Shortcuts />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
