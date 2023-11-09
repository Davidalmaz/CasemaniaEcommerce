import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../stylesheets/Signup.css";
import { useLoginMutation } from "../services/appApi";

function Login() {

  // Define state variables for email and password input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Use the useLoginMutation hook from appApi.js to handle user login
  const [login, { error, isError, isLoading }] = useLoginMutation();

  // Handle form submission when user clicks login button
  function handleLogin(e) {
    e.preventDefault();
    login({ email, password });
  }

  // Render the Login component
  return (
    <>
      <Container>
        <Row>
          {/* Column for Login form */}
          <Col md={6} className="login-form">
            <Form style={{ width: "100%" }} onSubmit={handleLogin}>
              <h1>Login to your account</h1>

              {/* Show an error alert if there is an error */}
              {isError && <Alert variant="danger">{error.data}</Alert>}

              {/* Form inputs for email*/}
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Form inputs for password*/}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Login button with loading state */}
              <Form.Group>
                <Button type="submit" disable={isLoading}>
                  Login
                </Button>
              </Form.Group>

              <p className="pt-3 text-center">
                Don't have an account? <Link to="/signup">Create account</Link>{" "}
              </p>
            </Form>
          </Col>

          {/* Column for Login image */}
          <Col md={6} className="login-image"></Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
