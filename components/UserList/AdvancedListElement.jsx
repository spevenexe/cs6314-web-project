import React, { useEffect, useState } from "react";
import { Chip, ListItem, ListItemText, Stack } from "@mui/material";

import "./styles.css";
import { Link } from "react-router-dom";
import { green, red } from "@mui/material/colors";
import { getComments, getPhotos } from "../../api/api";

/**
 * Advanced element. Features bubbles for photo counts and comment counts
 * */
function AdvancedListElement({ id: userId, first_name, last_name }) {
  const [numPhotos, setNumPhotos] = useState(0);
  const [numComments, setNumComments] = useState(0);

  useEffect(() => {
    getPhotos(userId)
      .then(({ ok, photosData }) => {
        if (!ok) return;
        // collect the number of photos posted by the user
        setNumPhotos(photosData.length);
      })
      .catch(() => {
        console.error("An error occurred while fetching the user photos");
      });
    }, [userId]);
    
  // fetch comments
  useEffect(() => {
    getComments(userId)
      .then(({ok, commentsData}) => {
        if (!ok) return;
        // collect the number of photos posted by the user
        setNumComments(commentsData.length);
      });
  }, [userId]);

  return (
    <Stack direction="row" justifyContent={"space-between"}>
      <Link to={`/users/${userId}`}>
        <ListItem>
          <ListItemText primary={`${first_name} ${last_name}`} />
        </ListItem>
      </Link>
      {/* We want the 2 bubbles to appear on the right, so we stack them together */}
      <Stack direction="row" spacing={1} alignItems={"center"}>
        {/* the photos button. Chip happens to be a conveniently round element, though it is not usally intended as a button.*/}
        <Chip
          label={numPhotos}
          component={Link}
          color="success"
          sx={{
            ":hover": {
              backgroundColor: green[300],
              cursor: "pointer",
            },
            ":active": {
              backgroundColor: green[900],
              cursor: "pointer",
            },
          }}
          to={`/photos/${userId}`}
        >
        </Chip>
        {/* the comments button */}
        <Chip
          label={numComments}
          component={Link}
          color="error"
          sx={{
            ":hover": {
              backgroundColor: red[300],
              cursor: "pointer",
            },
            ":active": {
              backgroundColor: red[900],
              cursor: "pointer",
            },
          }}
          to={`/comments/${userId}`}
        >
        </Chip>
      </Stack>
    </Stack>
  );
}

export default AdvancedListElement;
