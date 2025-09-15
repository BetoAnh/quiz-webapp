import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/profile/Dashboard";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import PrivateRoute from "./components/router/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/nav/Header";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route
            path="/login"
            element={
              <Login />
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
