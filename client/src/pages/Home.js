import axios from "../axios.js";
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import "../stylesheets/Home.css";
import logo from '../assets/logo-home.png'
import { useDispatch, useSelector } from "react-redux";
import { updateProducts } from "../features/productSlice.js";
import ProductReview from "../components/ProductReview.js";
import casesImg from "../assets/cases-category.png";
import accesoriesImg from "../assets/accesories-category.png";
import technologyImg from "../assets/technology-category.png";

// Array of categories with their names and images

const categories = [
  {
    name: "Cases",
    img: casesImg,
  },
  {
    name: "Accesories",
    img: accesoriesImg,
  },

  {
    name: "Technology",
    img: technologyImg,
  },
];

// Define the Home component

function Home() {
  const products = useSelector((state) => state.products);
  const lastProducts = products.slice(0, 8);
  const dispatch = useDispatch();
  const [imagePairs] = useState([
    [
    "https://res.cloudinary.com/dlzpwxy1u/image/upload/v1688707701/yizmiapomal86hhpphwp.jpg",
    "https://res.cloudinary.com/dlzpwxy1u/image/upload/v1688707701/nwlqbg5z2hptltktperd.jpg",
    ],
    [
    "https://res.cloudinary.com/dlzpwxy1u/image/upload/v1688707701/zikumasx9q5jmkdoawig.jpg",
    "https://res.cloudinary.com/dlzpwxy1u/image/upload/v1688707701/cugdwdvgirtcj2nwbvmp.jpg",
    ],
    [
    "https://res.cloudinary.com/dlzpwxy1u/image/upload/v1688707701/geifjyyduro6ncksf6ll.jpg",
    "https://res.cloudinary.com/dlzpwxy1u/image/upload/v1688707701/khbu97msw2xsievo1evl.jpg",
    ],
    // Add here all the URLs of the images you want to display in Cloudinary
  ]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);

  // Fetch the products from the server when the component mounts
  useEffect(() => {
    axios.get("/products").then(({ data }) => dispatch(updateProducts(data)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function is used to change the images displayed in the banner every (6000ms) 6 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPairIndex((index) => (index + 1) % imagePairs.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [imagePairs]);

  // Render the Home component
  return (
    <div>
      {/* Logo */}
      <div className="background-home">
        <div className='d-flex justify-content-center flex-wrap'><img
          src={logo}
          alt="Logo home"
          className="home-banner"
        />
        </div>

        {/* Featured Products */}
        <div className="featured-products container mt-4">
          <h2>Últimos productos</h2>
          <div className="d-flex justify-content-center flex-wrap">
            {lastProducts.map((product, index) => (
              <ProductReview key={index} {...product} />
            ))}
          </div>
          <div>
            <Link
              to="/category/all"
              style={{
                textAlign: "right",
                display: "block",
                textDecoration: "none",
              }}
            >
              Ver más {">>"}
            </Link>
          </div>
        </div>
      </div>

      {/* Sale banner */}
      <div className="sale-banner mt-4">
        <div className="row">
          {imagePairs[currentPairIndex].map((image, index) => (
            <div className="col-6" key={index}>
              <img src={image} alt="" />
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="background-home">
        <div className="recent-products container mt-4">
          <h2>Categorías</h2>
          <Row>
            {categories.map((category) => (
              <LinkContainer
                to={`/category/${category.name.toLocaleLowerCase()}`}
                key={category.name}
              >
                <Col md={4}>
                  <div
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`,
                      gap: "10px",
                    }}
                    className="category-title mb-3"
                  >
                    {category.name}
                  </div>
                </Col>
              </LinkContainer>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Home;