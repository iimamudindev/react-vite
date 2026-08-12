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


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
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
          <ProtectedRoute>
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
    <ProtectedRoute>
      <Transactions />
    </ProtectedRoute>
  }
/>
<Route
  path="/products"
  element={
    <ProtectedRoute>
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




    </Routes>
  );
}
