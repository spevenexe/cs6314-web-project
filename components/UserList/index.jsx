import React, { useEffect, useState } from "react";
import axios from "axios";
import { Divider, List, ListItem, ListItemText } from "@mui/material";

import "./styles.css";
import { Link } from "react-router-dom";
import AdvancedListElement from "./AdvancedListElement";


// the simple list element
function SimpleListElement({ id, first_name, last_name }) {
  return (
    <Link to={`/users/${id}`}>
      <ListItem>
        <ListItemText primary={`${first_name} ${last_name}`} />
      </ListItem>
    </Link>
  );
}


function UserList({ advancedFeatures }) {
  const [users, setUsers] = useState([]);

  // fetch the user list
  useEffect(() => {
    let response = axios.get("http://localhost:3001/user/list");

    response
      .catch((err) => {
        console.error(err.response.data);
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch(() => {
        console.log("An error occurred while setting the user list");
      });
  }, []);

  // decide which List Element type to render
  const ListElement = (advancedFeatures) ? AdvancedListElement : SimpleListElement;

  return (
    <List component="nav">
      {users.map((item, index) => (
        <React.Fragment key={item._id || index}>
          {<ListElement id={item._id} first_name={item.first_name} last_name={item.last_name} />}
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserList;
