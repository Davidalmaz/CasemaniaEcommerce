import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../stylesheets/Signup.css";
import { useSignupMutation } from "../services/appApi";


// Define the signup component

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Call the useSignupMutation hook from the appApi servie to handle user sign up
  const [signup, { error, isLoading, isError }] = useSignupMutation();

  // Define a function to handle user sign up
  function handleSignup(e) {
    e.preventDefault(); // Prevent the default form submission behavior
    signup({ name, email, password });  // Call the signup function with user input
  }

  // Render the Signup component
  return (
    <>
      <Container>
        <Row>
          <Col md={6} className="signup-form">
            <Form style={{ width: "100%" }} onSubmit={handleSignup}>
              <h1>Create an account</h1>

              {/* Show an error alert if there is an error */}
              {isError && <Alert variant="danger">{error.data}</Alert>}

              {/* Collect user's full name */}
              <Form.Group className="mb-3 mr-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your First Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Collect user's email address */}
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

              {/* Collect user's password */}
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

              {/* Show a button to submit the form */}
              <Form.Group>
                <Button type="submit" disabled={isLoading}>
                  Create Account
                </Button>
              </Form.Group>

              {/* Show a link to the login page */}
              <p className="pt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>{" "}
              </p>
            </Form>
          </Col>
          
          {/* Show an image in the other column */}
          <Col md={6} className="signup-image"></Col>
        </Row>
      </Container>
    </>
  );
}

export default Signup;