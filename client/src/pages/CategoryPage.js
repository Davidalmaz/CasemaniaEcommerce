import axios from "../axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { Col, Container, Row } from "react-bootstrap";
import ProductReview from "../components/ProductReview";
import "../stylesheets/CategoryPage.css";

function CategoryPage() {
  const { category } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load products from the server when the component mounts or the category parameter changes
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/products/category/${category}`)
      .then(({ data }) => {
        setLoading(false);
        setProducts(data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  }, [category]);

  if (loading) {
    <Loading />;
  }

  // Filter the products array based on the search term
  const productsSearch = products.filter((product) =>
  product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-page-container">

      {/* Render a banner with the category name */}
      <div
        className={`pt-3 ${category}-banner-container category-banner-container`}
      >
        <h1 className="text-center">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
      </div>

      {/* Render a search bar to filter products */}
      <div className="filters-container d-flex justify-content-center pt-4 pb-4">
        <input
          type="search"
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Render the products or a message is there are none */}
      {productsSearch.length === 0 ? (
        <h1>No products to show</h1>
      ) : (
        <Container>
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <div className="d-flex justify-content-center align-items-center flex-wrap">
                {productsSearch.map((product, index) => (
                  <ProductReview key={index} {...product} />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default CategoryPage;
