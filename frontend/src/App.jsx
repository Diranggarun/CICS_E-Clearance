import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import CreateUser from "./admin/CreateUser";
import AdminRecords from "./admin/AdminRecords";

import Sidebar from "./components/StudentSidebar";
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./student/StudentDashboard";
import MyClearance from "./student/MyClearance";
import Notifications from "./student/Notifications";


import OfficerLayout from "./layouts/OfficerLayout";
import OfficerDashboard from "./officer/OfficerDashboard";
import OfficerRequirement from "./officer/OfficerRequirement";
import OfficerRequests from "./officer/OfficerRequests";
import OfficerApproved from "./officer/OfficerApproved";
import OfficerDenied from "./officer/OfficerDenied";

import Payment from "./pages/Payment";


function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-user" element={<CreateUser />} />
          <Route path="/admin/records" element={<AdminRecords />} />
        </Route>

        <Route element={<StudentLayout />}> 
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/my-clearance" element={<MyClearance />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/student/payment" element={<Payment />} />
        </Route>


     <Route element={<OfficerLayout />}>
    <Route path="/officer" element={<Navigate to="/officer/dashboard" replace />} />
    <Route path="/officer/dashboard" element={<OfficerDashboard />} />
    <Route path="/officer/requirement" element={<OfficerRequirement />} />
    <Route path="/officer/requests" element={<OfficerRequests />} />
    <Route path="/officer/approved" element={<OfficerApproved />} />
    <Route path="/officer/denied" element={<OfficerDenied />} />
  </Route>
          
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
