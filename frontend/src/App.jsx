import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
<<<<<<< HEAD
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
=======
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import CreateUser from "./admin/CreateUser";
import AdminRecords from "./admin/AdminRecords";
<<<<<<< HEAD

import Sidebar from "./components/StudentSidebar";
=======
import AdminClearanceApprovals from "./admin/AdminClearanceApprovals";

>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./student/StudentDashboard";
import MyClearance from "./student/MyClearance";
import Notifications from "./student/Notifications";
<<<<<<< HEAD

=======
import Payment from "./student/Payment";
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

import OfficerLayout from "./layouts/OfficerLayout";
import OfficerDashboard from "./officer/OfficerDashboard";
import OfficerRequirement from "./officer/OfficerRequirement";
import OfficerRequests from "./officer/OfficerRequests";
import OfficerApproved from "./officer/OfficerApproved";
import OfficerDenied from "./officer/OfficerDenied";

<<<<<<< HEAD
import Payment from "./pages/Payment";

=======
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
import PendingAccounts from "./staff/PendingAccounts";
import PaymentVerification from "./staff/PaymentVerification";
import ManageFines from "./staff/ManageFines";
import Reports from "./staff/Reports";
<<<<<<< HEAD
=======
import CursorDashboard from "./staff/CursorDashboard";
import DepartmentDashboard from "./staff/DepartmentDashboard";
import BytesDashboard from "./staff/BytesDashboard";
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
import LibrarianDashboard from "./staff/LibrarianDashboard";
import AdviserDashboard from "./staff/AdviserDashboard";
import ChairpersonDashboard from "./staff/ChairpersonDashboard";
import DeanDashboard from "./staff/DeanDashboard";
<<<<<<< HEAD

=======
import EnrollingFacultyDashboard from "./staff/EnrollingFacultyDashboard";

// 9-stage workflow: Admin -> Cursor -> Department -> BYTES -> Library ->
// Adviser -> Chairperson -> Dean -> Enrolling Faculty.
const adminRoles = ["admin"];
const studentRoles = ["student"];
const cursorRoles = ["cursor_org"];
const departmentRoles = ["department_org"];
const bytesRoles = ["bytes_officer"];
const librarianRoles = ["librarian"];
const adviserRoles = ["faculty_adviser"];
const chairRoles = ["chairperson"];
const deanRoles = ["dean"];
const enrollingRoles = ["enrolling_faculty"];
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
=======
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin area — owns the staff surface (accounts, reports, users)
            and the first clearance stage. */}
        <Route
          element={
            <ProtectedRoute roles={adminRoles}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clearance-approvals" element={<AdminClearanceApprovals />} />
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
          <Route path="/admin/create-user" element={<CreateUser />} />
          <Route path="/admin/records" element={<AdminRecords />} />
          <Route path="/admin/pending-accounts" element={<PendingAccounts />} />
          <Route path="/admin/payment-verification" element={<PaymentVerification />} />
          <Route path="/admin/manage-fines" element={<ManageFines />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>

<<<<<<< HEAD
        <Route element={<OfficerLayout />}>
          <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
          <Route path="/adviser/dashboard" element={<AdviserDashboard />} />
          <Route path="/chairperson/dashboard" element={<ChairpersonDashboard />} />
          <Route path="/dean/dashboard" element={<DeanDashboard />} />
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
          
=======
        {/* Student area */}
        <Route
          element={
            <ProtectedRoute roles={studentRoles}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/my-clearance" element={<MyClearance />} />
          <Route path="/student/notifications" element={<Notifications />} />
          <Route path="/student/payment" element={<Payment />} />
        </Route>

        {/* Approver dashboards (each role gets its own gate) */}
        <Route
          element={
            <ProtectedRoute roles={cursorRoles}>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/cursor/dashboard" element={<CursorDashboard />} />
          <Route path="/cursor/payments" element={<PaymentVerification />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={departmentRoles}>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/department/dashboard" element={<DepartmentDashboard />} />
          <Route path="/department/payments" element={<PaymentVerification />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={bytesRoles}>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/bytes/dashboard" element={<BytesDashboard />} />
          <Route path="/bytes/payments" element={<PaymentVerification />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={librarianRoles}>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={adviserRoles}>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/adviser/dashboard" element={<AdviserDashboard />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={chairRoles}>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/chairperson/dashboard" element={<ChairpersonDashboard />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={deanRoles}>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dean/dashboard" element={<DeanDashboard />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={enrollingRoles}>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/enrolling/dashboard" element={<EnrollingFacultyDashboard />} />
        </Route>

        {/* Legacy officer namespace (kept logged-in but role-agnostic) */}
        <Route
          element={
            <ProtectedRoute>
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/officer" element={<Navigate to="/officer/dashboard" replace />} />
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/requirement" element={<OfficerRequirement />} />
          <Route path="/officer/requests" element={<OfficerRequests />} />
          <Route path="/officer/approved" element={<OfficerApproved />} />
          <Route path="/officer/denied" element={<OfficerDenied />} />
        </Route>

>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
