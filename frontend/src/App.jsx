import { Routes, Route, Navigate } from "react-router-dom";
import { Chat } from "./pages/Chat";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { NavBar } from "./components/NavBar";
import { ResetPassword } from "./pages/ResetPassword";
import { ChangePassword } from "./pages/ChangePassword";
import { VerifyCode } from "./pages/VerifyCode";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import VerifyEmail from "./pages/VerifyEmail";
import { ChatContextProvider } from "./context/ChatContext";
function App() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Container>
        <Routes>
          <Route
            path="/"
            element={user ? <Chat /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/sign-in"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/sign-up"
            element={user ? <Navigate to="/" /> : <Register />}
          />

          {/* Protected routes */}
          <Route
            path="/chat"
            element={user ? <Chat /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/reset-password"
            element={user ? <Chat /> : <ResetPassword />}
          />
          <Route
            path="/change-password"
            element={user ? <Chat /> : <ChangePassword />}
          />
          <Route
            path="/verify-code"
            element={user ? <Chat /> : <VerifyCode />}
          />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route path="*" element={<Navigate to={user ? "/" : "/sign-in"} />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  );
}

export default App;
