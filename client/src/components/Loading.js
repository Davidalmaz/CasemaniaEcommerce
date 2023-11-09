import React from "react";
import { Spinner } from "react-bootstrap";

function Loading() {

  // This component is used to display a loading spinner while data is being fetched

  // It renders a Spinner component in the center of the screen
  return (
    <div
      className="loading-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner animation="grow" />
    </div>
  );
}

export default Loading;
