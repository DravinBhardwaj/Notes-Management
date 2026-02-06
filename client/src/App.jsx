import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import EditNote from "./pages/EditNote";
import PdfViewer from "./pages/PdfViewer";
import AdminDashboard from "./admin/AdminDashboard";
import GroupDashboard from "./pages/GroupDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreateNote />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Documents />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/group"
          element={
            <ProtectedRoute>
              <AppLayout>
                <GroupDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:noteId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditNote />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* FULL SCREEN PDF */}
        <Route
          path="/view-pdf"
          element={
            <ProtectedRoute>
              <PdfViewer />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
