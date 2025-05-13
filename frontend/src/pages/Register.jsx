import React, { useState } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Add this

export const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
  } = useContext(AuthContext);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const success = await registerUser(e);
    if (success) {
      setRegistrationSuccess(true);
      // Clear form
      updateRegisterInfo({
        fullName: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row
        style={{ height: "100vh", justifyContent: "center", paddingTop: "10%" }}
      >
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Register</h2>

            {registrationSuccess ? (
              <Alert variant="success">
                Registration successful! Please check your email for verification instructions.
                <br />
                <Button variant="link" onClick={() => navigate("/sign-in")}>
                  Go to Login
                </Button>
              </Alert>
            ) : (
              <>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={registerInfo.fullName}
                  onChange={(e) =>
                    updateRegisterInfo({
                      ...registerInfo,
                      fullName: e.target.value,
                    })
                  }
                />
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={registerInfo.email}
                  onChange={(e) =>
                    updateRegisterInfo({
                      ...registerInfo,
                      email: e.target.value,
                    })
                  }
                />
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={registerInfo.password}
                  onChange={(e) =>
                    updateRegisterInfo({
                      ...registerInfo,
                      password: e.target.value,
                    })
                  }
                />
                <Button variant="primary" type="submit">
                  {isRegisterLoading ? "Registering..." : "Register"}
                </Button>
              </>
            )}

            {registerError?.error && (
              <Alert variant="danger">
                <p>{registerError?.message}</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};
