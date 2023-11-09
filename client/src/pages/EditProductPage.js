import React, { useEffect, useState } from "react";
import "../stylesheets/NewProduct.css";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProductMutation } from "../services/appApi";
import { Alert, Col, Container, Form, Row, Button } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import axios from "../axios.js";

function EditProductPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null);
  const navigate = useNavigate();

  // Custom hook for updating a product
  const [updateProduct, { error, isError, isLoading, isSuccess }] =
    useUpdateProductMutation();

  useEffect(() => {
    // Get request to fetch the product data from the server
    axios
      .get(`/products/${id}`)
      .then(({ data }) => {
        const product = data.product;
        setName(product.name);
        setDescription(product.description);
        setCategory(product.category);
        setImages(product.pictures);
        setPrice(product.price);
      })
      .catch((error) => console.log(error));
  }, [id]);

  // Function for removing an image from the product images
  function handleRemoveImage(removedImage) {
    setImgToRemove(removedImage.public_id);
    axios
      .delete(`/images/${removedImage.imageId}`, { data: removedImage })
      .then((res) => {
        setImgToRemove(null);
        setImages((images) =>
          images.filter((image) => image.public_id !== removedImage.public_id)
        );
      })
      .catch((error) => console.log(error));
  }

  // Function to handling the form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !description || !price || !category || !images.length) {
      return alert("Please fil out all the fields");
    }
    updateProduct({ id, name, description, price, category, images }).then(
      ({ data }) => {
        if (data.length > 0) {
          console.log("Success updating product");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      }
    );
  }

  // Function for displaying the Cloudinary upload widget
  function showWidget(e) {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dlzpwxy1u",
        uploadPreset: "CaseMania",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          // console.log(result.info);
          const id = result.info.public_id.replace("CaseMania-Folder/", ""); // Extract the image ID from the public ID
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
              <h1 className="mt-4">Edit product</h1>

              {/* Displaying a success message if the product was successfully updated */}
              {isSuccess && (
                <Alert variant="success">Product has been updated</Alert>
              )}

              {/* Displaying an error message if there was an error updating the product */}
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

              {/* Dropdown menu for selecting the product category */}
              <Form.Group
                className="mb-3"
                onChange={(e) => setCategory(e.target.value)}
              >
                <Form.Label>Category</Form.Label>
                <Form.Select value={category}>
                  <option selected disabled>
                    -- Select One --
                  </option>
                  <option value="cases">Cases</option>
                  <option value="accesories">Accesories</option>
                  <option value="technology">Technology</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Button type="button" onClick={showWidget}>
                  Upload Images
                </Button>
                <div className="images-preview-container">
                  {images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image.url} alt="product-review" />
                      {/* Icon for removing an image */}
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

              {/* Submit button for updating the product */}
              <Form.Group>
                <Button type="submit" disabled={isLoading || isSuccess}>
                  Update Product
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

export default EditProductPage;
