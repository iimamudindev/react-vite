import DashboardFinal from "./pages/DashboardFinal";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Receipt from "./pages/Receipt";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ActivityLogs from "./pages/ActivityLogs";
import POS from "./pages/POS";
import Transactions from "./pages/Transactions";
import Products from "./pages/Products";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />




       <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardFinal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity-logs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ActivityLogs />
          </ProtectedRoute>
        }
      />

<Route
  path="/pos"
  element={
    <ProtectedRoute>
      <POS />
    </ProtectedRoute>
  }
/>


      <Route
        path="/transactions"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Products />
          </ProtectedRoute>
        }
      />



<Route
  path="/receipt/:id"
  element={
    <ProtectedRoute>
      <Receipt />
    </ProtectedRoute>
  }
/>

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
}
