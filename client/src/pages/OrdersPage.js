import axios from "../axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Badge, Container, Table } from "react-bootstrap";
// import "../stylesheets/OrdersPage.css";
import Loading from "../components/Loading";

// Define the OrdersPage component

function OrdersPage() {
  const user = useSelector((state) => state.user);
  // const products = useSelector((state) => state.products);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [orderToShow, setOrderToShow] = useState([]);
  // const [show, setShow] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/users/${user._id}/orders`)
      .then(({ data }) => {
        setLoading(false);
        setOrders(data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the orders are still loading, show a loading spinner
  if (loading) {
    return <Loading />;
  }

  // if the user has no orders, show a message
  if (orders.length === 0) {
    return <h1 className="text-center pt-3">No orders yet</h1>;
  }

  // If the user has orders, display them in a table
  return (
    <Container>
      <h1 className="text-center">Your orders</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Date</th>
            <th>Total</th>
            {/* <th>&nbsp;</th> */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>
                <Badge
                  bg={`${
                    order.status === "processing" ? "warning" : "success"
                  }`}
                  text="white"
                >
                  {order.status}
                </Badge>
              </td>
              <td>{order.date}</td>
              <td>${order.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default OrdersPage;
