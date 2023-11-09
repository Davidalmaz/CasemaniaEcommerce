import React from "react";
// import "../stylesheets/AdminDashboard.css";
import { Container, Nav, Tab, Col, Row } from "react-bootstrap";
import DashboardProducts from "../components/DashboardProducts";
import OrdersAdminPage from "../components/OrdersAdminPage";
import ClientsAdminPage from "../components/ClientsAdminPage";

function AdminDashboard() {
  return (
    <Container>

      {/* Render a tab container for products, orders, and clients */}
      <Tab.Container defaultActiveKey="products">
        <Row>

          {/* Render a sidebar with links to each tab */}
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="products">Products</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="clients">Clients</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          {/* Render the content of each tab */}
          <Col sm={9}>
            <Tab.Content>

              {/* Render the products tab */}
              <Tab.Pane eventKey="products">
                <DashboardProducts />
              </Tab.Pane>
              
              {/* Render the orders tab */}
              <Tab.Pane eventKey="orders">
                <OrdersAdminPage />
              </Tab.Pane>

              {/* Render the clients tab */}
              <Tab.Pane eventKey="clients">
                <ClientsAdminPage />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default AdminDashboard;
