import axios from "../axios";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { Table } from "react-bootstrap";

function ClientsAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use the useEffect hook to fetch the list of users from the server
  useEffect(() => {
    // Set the loading flag to true before making the request
    setLoading(true);
    axios
      .get("/users")
      .then(({ data }) => {
        // Set the users state to the response data and set the loading flag to false
        setLoading(false);
        setUsers(data);
      })
      .catch((error) => {
        // If there is an error, set the loading flag to false and log the error to the console
        setLoading(false);
        console.log(error);
      });
  }, []);

  // If the loading flag is true, render the Loading component
  if (loading) return <Loading />;
  if (users.length === 0)
    return <h2 className="py-2 text-center">No users yet</h2>;

    // If there are users, render a table with their information
  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Client Id</th>
          <th>Client Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ClientsAdminPage;
