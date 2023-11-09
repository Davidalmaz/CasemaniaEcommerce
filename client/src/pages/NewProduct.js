import React, { useState } from "react";
import "../stylesheets/NewProduct.css";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../services/appApi";
import { Alert, Col, Container, Form, Row, Button } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import axios from "../axios.js";

function NewProduct() {

  // Sattes to hold the values of the input fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null);

  // Navigate function from react-router-dom to navigate to other pages
  const navigate = useNavigate();

  // Mutation function from appApi to create a new product
  const [createProduct, { error, isError, isLoading, isSuccess }] =
    useCreateProductMutation();

  // Function to remove an image from the list of images
  function handleRemoveImage(removedImage) {
    // Set the image to remove
    setImgToRemove(removedImage.public_id);

    // Send a delete request ti the server to delete the image
    axios
      .delete(`/images/${removedImage.imageId}`, { data: removedImage })
      .then((res) => {
        // Reset the image to remove
        setImgToRemove(null);
        // Remove the image from the list of images
        setImages((images) =>
          images.filter((image) => image.public_id !== removedImage.public_id)
        );
      })
      .catch((error) => console.log(error));
  }

  // function to handle the submission of the form
  function handleSubmit(e) {
    e.preventDefault();
    // Check if all the fields are filled out
    if (!name || !description || !price || !category || !images.length) {
      return alert("Please fil out all the fields");
    }
    // Call the createProduct mutation function to create a new product
    createProduct({ name, description, price, stock, category, images }).then(
      ({ data }) => {
        if (data.length > 0) {
          // Log a message to the console if the product was created successfully
          console.log("Success creating product");
          // Navigate to the home page after a delay of 1.5 seconds
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      }
    );
  }

  // Function to show the Cloudinary widget for uploading images
  function showWidget(e) {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dlzpwxy1u",
        uploadPreset: "CaseMania",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          // console.log(result.info);
          // Add the uploaded image to the list of images
          const id = result.info.public_id.replace("CaseMania-Folder/", "");
          setImages((prevState) => [
            ...prevState,
            {
              url: result.info.url,
              public_id: result.info.public_id,
              imageId: id,
            },
          ]);
        }
      }
    );
    widget.open();
  }

  return (
    <>
      <Container>
        <Row>
          <Col md={6} className="new-product-form">
            <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <h1 className="mt-4">Create a product</h1>

              {/* Show a success message if the product was create successfully */}
              {isSuccess && (
                <Alert variant="success">Product created with succcess</Alert>
              )}

              {/* Show an error message if there was an error creating the product */}
              {isError && <Alert variant="danger">{error.data}</Alert>}

              {/* Input field for the product name */}
              <Form.Group className="mb-3">
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              {/* Input field for the product description */}
              <Form.Group className="mb-3">
                <Form.Label>Product description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Product description"
                  style={{ height: "100px" }}
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              {/* Input field for the product price */}
              <Form.Group className="mb-3">
                <Form.Label>Price($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Price ($)"
                  value={price}
                  required
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              {/* Input field for the product stock */}
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  required
                  onChange={(e) => setStock(e.target.value)}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                onChange={(e) => setCategory(e.target.value)}
              >
                <Form.Label>Category</Form.Label>
                {/* Dropdown menu for the product category */}
                <Form.Select>
                  <option selected disabled>
                    -- Select One --
                  </option>
                  <option value="cases">Cases</option>
                  <option value="accesories">Accesories</option>
                  <option value="technology">Technology</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                {/* Button to show the Cloudinary widget for uploading images */}
                <Button type="button" onClick={showWidget}>
                  Upload Images
                </Button>

                {/* Container to show the preview of uploaded images */}
                <div className="images-preview-container">
                  {images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image.url} alt="product-review" />

                      {/* Button to remove an uploeaded image */}
                      {imgToRemove !== image.public_id && (
                        <FaTimesCircle
                          className="image-preview-icon"
                          onClick={() => handleRemoveImage(image)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Form.Group>

              <Form.Group>
                {/* Button to submit the form and create a new product */}
                <Button type="submit" disabled={isLoading || isSuccess}>
                  Create Product
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col md={6} className="new-product-image"></Col>
        </Row>
      </Container>
    </>
  );
}

export default NewProduct;
