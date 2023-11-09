import React from "react";
import { Badge, Card } from "react-bootstrap";
import LinkContainer from "react-router-bootstrap/LinkContainer";

// Define the SimilarProduct component

function SimilarProduct({ _id, name, category, pictures }) {
  // This component returns a Card component wrapped in a LinkContainer component

  return (
    // The LinkContainer component creates a link to the product detail page
    <LinkContainer
      to={`/product/${_id}`}
      style={{ cursor: "pointer", width: "13rem", margin: "10px" }}
    >
      {/* The Card component displays the product image, name, and category */}
      <Card style={{ width: "20rem", margin: "10px" }}>
        <Card.Img
          variant="top"
          className="product-preview-img"
          src={pictures[0]?.url}
          style={{ height: "200px", width:"100%", objectFit: "contain" }}
        />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Badge bg="warning" text="dark">
            {category}
          </Badge>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}

export default SimilarProduct;
