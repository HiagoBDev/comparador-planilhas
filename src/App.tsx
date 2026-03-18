import { HashRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/presentation/pages/home-page";
import { ComparisonPage } from "@/presentation/pages/comparison-page";
import { useThemeStore } from "@/application/store/theme-store";
import { useEffect } from "react";

function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/comparison/:id" element={<ComparisonPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
