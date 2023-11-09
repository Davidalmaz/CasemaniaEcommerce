import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Badge, Form, ButtonGroup, Button} from "react-bootstrap";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Loading from "../components/Loading";
import SimilarProduct from "../components/SimilarProduct";
import axios from "../axios";
import "../stylesheets/ProductPage.css";
import LinkContainer from "react-router-bootstrap/LinkContainer";
import { useAddToCartMutation } from "../services/appApi";
import ToastMessage from "../components/ToastMessage";

function ProductPage() {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState(null);

  // Use the useAddToCartMutation hook from appApi.js to thandle adding to cart
  const [addToCart, { isSuccess }] = useAddToCartMutation();

  // Prevent dragging of carousel images
  const handleDragStart = (e) => e.preventDefault();

  // Use useEffect to fetch the product data from the server
  useEffect(() => {
    axios.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.product);
      setSimilar(data.similar);
    });
  }, [id]);

  // Show a loading spinner until the product data has been fetched
  if (!product) {
    return <Loading />;
  }

  // Define the responsive settings for the similar products carousel
  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
  };

  // Create an array of carousel images from the product's pictures
  const images = product.pictures.map((picture) => (
    <img
      className="product-carousel"
      alt="carousel"
      src={picture?.url}
      onDragStart={handleDragStart}
    />
  ));

  // Create an array of SimilarProduct components from the similar products data
  let similarProducts = [];
  if (similar) {
    similarProducts = similar.map((product, index) => (
      <div className="item" data-value={index}>
        <SimilarProduct {...product} />
      </div>
    ));
  }

  // Render the ProductPage component
  return (
    <Container className="pt-4" style={{ position: "relative" }}>
      <Row>

        {/* Left column for product images */}
        <Col lg={6}>
          <AliceCarousel
            mouseTracking
            items={images}
            controlsStrategy="alternate"
          />
        </Col>

        {/* Right column for product details */}
        <Col lg={6} className="pt-4 px-4">
          <h1>{product.name}</h1>
          <p>
            <Badge bg="primary">{product.category}</Badge>
          </p>
          <p className="product__price">${product.price}</p>
          <p style={{ textAlign: "justify" }} className="py-3">
            <strong>Description:</strong> {product.description}
          </p>
          
          {/* Add to cart form for non-admin users */}
          {user && !user.isAdmin && product.stock > 0 && (
            <ButtonGroup style={{ width: "90%" }}>
              <Form.Select
                size="lg"
                style={{ width: "40%", borderRadius: "0" }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Select>
              <Button
                size="lg"
                onClick={() =>
                  addToCart({
                    userId: user._id,
                    productId: id,
                    price: product.price,
                    image: product.pictures[0]?.url,
                  })
                }
              >
                Add to cart
              </Button>
            </ButtonGroup>
          )}

          {/* Edit product button for admin users*/}
          {user && user.isAdmin && (
            <LinkContainer to={`/product/${product._id}/edit`}>
              <Button size="lg">Edit Product</Button>
            </LinkContainer>
          )}

          {/* Show a success toast message if the product was added to cart */}
          {isSuccess && (
            <ToastMessage
              bg="info"
              title="Added to cart"
              body={`${product.name} is in your cart`}
            />
          )}
        </Col>
      </Row>

      {/* Similar products carousel */}
      <div className="my-4">
        <h2>Similar Products</h2>
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <AliceCarousel
            mouseTracking
            items={similarProducts}
            responsive={responsive}
            controlsStrategy="alternate"
          />
        </div>
      </div>
    </Container>
  );
}

export default ProductPage;
