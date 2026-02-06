import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {children}

        {/* 🌍 Global Toasts */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppProviders;
