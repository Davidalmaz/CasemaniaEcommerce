import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import "../stylesheets/ToastMessage.css";

// Define the ToastMessage component that takes bg, title, and body as props

function ToastMessage({ bg, title, body }) {
  const [show, setShow] = useState(true);

  return (

    // Create a ToastContainer component from React bootstrap
    <ToastContainer position="bottom-right" className="toast-container">
      <Toast
        bg={bg}
        onClose={() => setShow(false)}
        show={show}
        delay={3000}
        autohide
      >
        
        {/* Add the title and body of the toast indise the Toast component */}
        <Toast.Header>
          <strong className="me-auto">{title}</strong>
          <small>now</small>
        </Toast.Header>
        <Toast.Body>{body}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastMessage;
