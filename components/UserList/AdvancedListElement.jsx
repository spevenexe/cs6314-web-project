import React from "react";
import { Chip, ListItem, ListItemText, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import "./styles.css";
import { Link } from "react-router-dom";
import { green, red } from "@mui/material/colors";
import { getComments, getPhotos } from "../../api/api";

/**
 * Advanced element. Features bubbles for photo counts and comment counts
 * */
function AdvancedListElement({ id: userId, first_name, last_name }) {
  // fetch photos count
  const {
    isPending: isPhotosPending,
    isError: isPhotosError,
    data: numPhotos,
    error: photoError,
  } = useQuery({
    queryKey: ["photoCount", userId],
    queryFn: () => getPhotos(userId).then((photosData) => photosData.length),
  });

  // fetch comments count
  const {
    isPending: isCommentsPending,
    isError: isCommentsError,
    data: numComments,
    error: commentsError,
  } = useQuery({
    queryKey: ["commentCount", userId, "userComments"],
    queryFn: () => getComments(userId).then((commentsData) => commentsData.length),
  });

  // check the state of the promise
  if (isPhotosPending || isCommentsPending) return <>Loading...</>;
  if (isPhotosError) {
    return <>An error occurred while fetching photos: {photoError.message}</>;
  }
  if (isCommentsError) {
    return (
      <>An error occurred while fetching comments: {commentsError.message}</>
    );
  }

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
