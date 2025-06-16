// export default App;
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans text-gray-900">
          <Routes>
            {AppRoutes.map(({ path, element, isProtected }, index) => (
              <Route
                key={index}
                path={path}
                element={
                  isProtected ? (
                    <ProtectedRoute>{element}</ProtectedRoute>
                  ) : (
                    element
                  )
                }
              />
            ))}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
