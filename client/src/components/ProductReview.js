import React from "react";
import { Badge, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// Functional component that takes in props for product ID, category, name and pictures
function ProductReview({ _id, category, name, pictures }) {
  return (
    <LinkContainer
      to={`/product/${_id}`}
      style={{ cursor: "pointer", width: "13rem", margin: "10px" }}
    >
      {/* Bootstrap card component for displaying product information */}
      <Card style={{ width: "20rem", margin: "10px" }}>
        <Card.Img
          variant="top"
          className="product-preview-img"
          src={pictures[0]?.url}
          style={{ height: "200px", width:"100%", objectFit: "contain" }}
        />
        <Card.Body>
          {/* Product name */}
          <Card.Title>{name}</Card.Title>

          {/* Bootstrap badge component for displaying the product category */}
          <Badge bg="warning" text="dark">
            {category}
          </Badge>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}

export default ProductReview;
