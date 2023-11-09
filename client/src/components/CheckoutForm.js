import { useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { CardElement } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [alertMessage, setAlertMessage] = useState("");
  const [createOrder, { isLoading, isError, isSuccess }] =
    useCreateOrderMutation();
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);

  // Handle the form submission to make the payment
  async function handlePay(e) {
    e.preventDefault();
    // Check if Stripe is loaded, if the cart is not empty, and if the payment is not already processing
    if (!stripe || !elements || user.cart.count <= 0) return;
    // Set the payment processing flag to true
    setPaying(true);
    // Make a POST request to the server to create a payment intent with the order total
    const { client_secret } = await fetch(
      "http://localhost:8080/create-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: user.cart.total }),
      }
    ).then((res) => res.json());
    // Confirm the card payment with the payment intent and the CardElement
    const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    // Set the payment processing flag to false
    setPaying(false);

    // If the payment is successful, create an order with the user ID, cart, addres, and city
    if (paymentIntent) {
      createOrder({ userId: user._id, cart: user.cart, address, city }).then(
        (res) => {
          // If the order creation is not loading and has an error, log the error to the console
          if (!isLoading && isError) {
          }
        }
      );
      // Set an alert message with the payment status and navigate to the orders page after 2 seconds
      setAlertMessage(`Payment ${paymentIntent.status}`);
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    }
  }

  return (
    <Col className="cart-payment-container">
      <Form onSubmit={handlePay}>

        {/* Render an alert message if there is one */}
        <Row>
          {alertMessage && <Alert>{alertMessage}</Alert>}

          {/* Render the user's name and email */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                value={user.name}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                value={user.email}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Allow the user to enter their address and city */}
        <Row>
          <Col md={7}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Render the stripe CardElement */}
        <label htmlFor="card-element">Card</label>
        <CardElement id="card-element" />
        <Button
          className="mt-3"
          type="submit"
          disabled={user.cart.count <= 0 || paying || isSuccess}
        >
          {/* Show "Processing..." if the payment is being processed, or "Pay" id not */}
          {paying ? "Processing..." : "Pay"}
        </Button>
      </Form>
    </Col>
  );
}

export default CheckoutForm;
