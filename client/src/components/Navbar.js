import React, { useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import "../stylesheets/Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { logout, resetNotifications } from "../features/userSlice";
import { FaShoppingCart, FaBell } from "react-icons/fa";
import axios from "../axios";
import moment from "moment";

function Navigation() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const bellRef = useRef(null);
  const notificationRef = useRef(null);
  const [bellPosition, setBellPosition] = useState({});

  // Calculate the number of unread notifications
  const unreadNotifications = user?.notifications?.reduce((acc, current) => {
    if (current.status === "unread") return acc + 1;
    return acc;
  }, 0);

  // Handle the logout button click
  function handleLogout() {
    dispatch(logout());
  }

  // Handle the click on the bell icon to toggle the display of notifications
  function handleToggleNotifications() {
    const position = bellRef.current.getBoundingClientRect();
    setBellPosition(position);
    notificationRef.current.style.display =
      notificationRef.current.style.display === "block" ? "none" : "block";
    dispatch(resetNotifications());
    if (unreadNotifications > 0)
      axios.post(`/users/${user._id}/updateNotifications`);
  }

  return (
    // The main navigation bar component
    <Navbar bg="light" expand="lg">
      <Container>
        {/* The link to the home page */}
        <LinkContainer to="/">
        <Navbar.Brand className="navbar-brand-white" href="#">Case Mania</Navbar.Brand>  
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* if user not logged in */}
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>Iniciar sesión</Nav.Link>
              </LinkContainer>
            )}

            {/* user cart (if user is logged in) */}
            {user && !user.isAdmin && (
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart fontSize="20px" />
                  {user?.cart.count > 0 && (
                    <span className="badge badge-warning " id="cartcount">
                      {user.cart.count}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}

            {/* if user is logged in */}
            {user && (
              <>
                <Nav.Link
                  style={{ position: "relative" }}
                  onClick={handleToggleNotifications}
                  ref={bellRef}
                >
                  <span
                    className="fa-bell"
                    data-count={unreadNotifications || null}
                  >
                    <FaBell fontSize="20px" />
                  </span>
                </Nav.Link>
                <NavDropdown title={user.email} id="basic-nav-dropdown">
                  {/* if user is admin */}
                  {user.isAdmin && (
                    <>
                      <LinkContainer to="/admin">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/new-product">
                        <NavDropdown.Item>Create Product</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  {/* if user is not an admin */}
                  {!user.isAdmin && (
                    <>
                      <LinkContainer to="/cart">
                        <NavDropdown.Item>Cart</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orders">
                        <NavDropdown.Item>My orders</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  {/* The logout button */}
                  <NavDropdown.Divider />
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Logout
                  </Button>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      {/* notification */}
      <div
        className="notifications-container"
        ref={notificationRef}
        style={{
          position: "absolute",
          top: bellPosition.top + 50,
          left: bellPosition.left - 40,
          display: "none",
        }}
      >
        {/* Display the notification if there are any */}
        {user?.notifications.length > 0 ? (
          user?.notifications.map((notification) => (
            <p className={`notification-${notification.status}`}>
              {notification.message}
              <br />
              {/* Display the date the notification was sent */}
              <span style={{ display: "block" }}>
                {moment(notification.time).format("dddd, Do MMMM YYYY")}
              </span>
              {/* Display the time the notification was sent */}
              <span>{moment(notification.time).format("h:mm:ss a")}</span>
            </p>
          ))
        ) : (
          // Display a message if there are no notifications
          <p>No notifcations yet</p>
        )}
      </div>
    </Navbar>
  );
}

export default Navigation;
