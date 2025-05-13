import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Spinner, Button } from "react-bootstrap";
import { verifyEmail } from "../utils/auth";

const VerifyEmail = () => {
  const { token } = useParams();
  const [state, setState] = useState({
    loading: true,
    error: null,
    success: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);

        // Handle non-JSON responses
        if (typeof response === "string") {
          try {
            // Attempt to parse unusual responses
            const parsed = JSON.parse(response.replace(/^\(|\)$/g, ""));
            if (parsed.message.includes("verified successful")) {
              setState({ loading: false, error: null, success: true });
              setTimeout(() => navigate("/sign-in"), 3000);
              return;
            }
          } catch (e) {
            throw new Error("Invalid verification response");
          }
        }

        // Handle proper JSON responses
        if (response?.error) {
          throw new Error(response.message || "Verification failed");
        }

        setState({ loading: false, error: null, success: true });
        setTimeout(() => navigate("/sign-in"), 3000);
      } catch (err) {
        setState({
          loading: false,
          error: err.message || "Verification failed",
          success: false,
        });
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div style={{ maxWidth: "500px", width: "100%" }}>
        {state.loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Verifying your email...</p>
          </div>
        ) : state.error ? (
          <>
            <Alert variant="danger" className="text-center">
              <Alert.Heading>Verification Failed</Alert.Heading>
              <p>{state.error}</p>
              {token && (
                <div className="mt-2 small">
                  <p className="mb-1">Token used:</p>
                  <code>{token}</code>
                </div>
              )}
            </Alert>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={() => navigate("/sign-in")}
                size="lg"
              >
                Go to Login
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => window.location.reload()}
                size="sm"
              >
                Try Again
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Alert variant="success">
              <Alert.Heading>Email Verified Successfully!</Alert.Heading>
              <p>You will be redirected to login shortly.</p>
            </Alert>
            <Spinner animation="border" size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
