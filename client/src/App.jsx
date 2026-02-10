import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import ServerWakeUp from "./components/ServerWakeUp";

import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import EditNote from "./pages/EditNote";
import PdfViewer from "./pages/PdfViewer";
import AdminDashboard from "./admin/AdminDashboard";
import GroupDashboard from "./pages/GroupDashboard";

function App() {
  const [serverReady, setServerReady] = useState(false);

  // show wake-up screen until backend is ready
  if (!serverReady) {
    return <ServerWakeUp onReady={() => setServerReady(true)} />;
  }

  return (
    <>
      <Navbar />

      <Routes>
        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        {/* CREATE NOTE */}
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

        {/* DOCUMENTS */}
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

        {/* GROUP */}
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

        {/* EDIT NOTE */}
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

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* SUPER ADMIN */}
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
