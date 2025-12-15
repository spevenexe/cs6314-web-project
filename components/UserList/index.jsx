import React, { useEffect } from "react";
import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import "./styles.css";
import { Link } from "react-router-dom";
import AdvancedListElement from "./AdvancedListElement";
import { getUserList } from "../../api/user";
import { useAdvancedFeature } from "../../lib/store";
import socket from "../../api/socket";

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

function UserList() {
  const { advancedEnabled } = useAdvancedFeature();

  // fetch the user list
  const {
    isPending,
    isError,
    data: users,
    error,
  } = useQuery({
    queryKey: ["userList"],
    queryFn: getUserList,
  });

  const queryClient = useQueryClient();
  // subscribe socket to deletion events
  useEffect(() =>{
    const handleUserDeleteEvent = () => {
      queryClient.invalidateQueries({queryKey:["userList"]});
    };

    socket.on("user delete",handleUserDeleteEvent);

    return () => {
      socket.off("user delete",handleUserDeleteEvent);
    };
  },[]);

  // check the state of the promise
  if (isPending) return <>Loading...</>;
  if (isError) {
    return <>An error occurred while fetching the database: {error.message}</>;
  }
  // decide which List Element type to render
  const ListElement = advancedEnabled ? AdvancedListElement : SimpleListElement;

  return (
    <List component="nav">
      {users.map((item, index) => (
        <React.Fragment key={item._id || index}>
          {
            <ListElement
              id={item._id}
              first_name={item.first_name}
              last_name={item.last_name}
            />
          }
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserList;
