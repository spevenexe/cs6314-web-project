import React from "react";
import { Divider, List, ListItem, ListItemText } from "@mui/material";

import "./styles.css";
import { Link } from "react-router-dom";
import AdvancedListElement from "./AdvancedListElement";
import { useQuery } from "@tanstack/react-query";
import { getUserList } from "../../api/api";


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

  // fetch the user list
  const { isPending, isError, data: users, error } = useQuery({
    queryKey: ["userList"],
    queryFn: getUserList
  })

  // check the state of the promise
  if (isPending) return <>Loading...</>;
  if (isError)
    return <>An error occurred while fetching the database: {error.message}</>;


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
