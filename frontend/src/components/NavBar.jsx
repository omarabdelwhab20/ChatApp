import React, { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.74rem" }}>
      <Container>
        <h2>
          <Link to={"/"} className="link-light text-decoration-none">
            ChatApp
          </Link>
        </h2>
        {user && <span className="text-warning">{user?.fullName}</span>}
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {user && (
              <>
                <Link
                  onClick={() => logOut()}
                  to={"/sign-in"}
                  className="link-light text-decoration-none"
                >
                  Logout
                </Link>
              </>
            )}
            {!user && (
              <>
                <Link
                  to={"/sign-in"}
                  className="link-light text-decoration-none"
                >
                  Login
                </Link>
                <Link
                  to={"/sign-up"}
                  className="link-light text-decoration-none"
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};
