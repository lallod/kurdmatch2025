
import { Routes, Route } from "react-router-dom";
import SuperAdminLayout from "./layout/SuperAdminLayout";
import OverviewDashboard from "./pages/OverviewDashboard";
import UsersManagement from "./pages/UsersManagement";
import CustomersPage from "./pages/CustomersPage";
import ProposalsPage from "./pages/ProposalsPage";
import InvoicesPage from "./pages/InvoicesPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import TodosPage from "./pages/TodosPage";
import TransactionsPage from "./pages/TransactionsPage";
import RolesPage from "./pages/RolesPage";
import UserListPage from "./pages/UserListPage";
import ReportsPage from "./pages/ReportsPage";
import ActionLogsPage from "./pages/ActionLogsPage";

const SuperAdmin = () => {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route path="/" element={<OverviewDashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/user-list" element={<UserListPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/action-logs" element={<ActionLogsPage />} />
      </Routes>
    </SuperAdminLayout>
  );
};

export default SuperAdmin;
