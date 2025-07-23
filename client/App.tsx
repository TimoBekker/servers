import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import InformationSystems from "./pages/InformationSystems";
import Software from "./pages/Software";
import SoftwareDistributions from "./pages/SoftwareDistributions";
import InstalledSoftware from "./pages/InstalledSoftware";
import Contracts from "./pages/Contracts";
import Events from "./pages/Events";
import Directories from "./pages/Directories";
import Reports from "./pages/Reports";
import ReportsResponsible from "./pages/ReportsResponsible";
import ReportsResources from "./pages/ReportsResources";
import ReportsLicenses from "./pages/ReportsLicenses";
import ApiTest from "./pages/ApiTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route
              path="/information-systems"
              element={<InformationSystems />}
            />
            <Route path="/software" element={<Software />} />
            <Route
              path="/software/distributions"
              element={<SoftwareDistributions />}
            />
            <Route path="/software/installed" element={<InstalledSoftware />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/events" element={<Events />} />
            <Route path="/directories" element={<Directories />} />
            <Route path="/reports" element={<Reports />} />
            <Route
              path="/reports/responsible"
              element={<ReportsResponsible />}
            />
            <Route path="/reports/resources" element={<ReportsResources />} />
            <Route path="/reports/licenses" element={<ReportsLicenses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
