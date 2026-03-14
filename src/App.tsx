import { Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import HomePage from "./pages/HomePage";
import CasesPage from "./pages/CasesPage";
import InventoryPage from "./pages/InventoryPage";
import CrashPage from "./pages/CrashPage";
import RoulettePage from "./pages/RoulettePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="crash" element={<CrashPage />} />
        <Route path="roulette" element={<RoulettePage />} />
      </Route>
    </Routes>
  );
}

export default App;
