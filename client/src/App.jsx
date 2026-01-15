import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditNote from "./pages/EditNote"; 
function App() {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateNote />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit/:noteId" element={<EditNote />} />

          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
