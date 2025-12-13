import React from "react";
import { Button, Chip, Divider, ImageList, ImageListItem, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import "./styles.css";
import { Link } from "react-router-dom";
import { green, red } from "@mui/material/colors";
import { getFavorites } from "../../api/api";
import { HashLink } from "react-router-hash-link";
import { useAdvancedFeature } from "../../api/store";

/**
 * Advanced element. Features bubbles for photo counts and comment counts
 * */
function Favorites() {
  const { advancedEnabled } = useAdvancedFeature();

  // fetch comments
  const {
    isPending,
    isError,
    data: favorites,
    error,
  } = useQuery({
    queryKey: ["favoritesList"],
    queryFn: getFavorites,
  });

  // check the state of the promise
  if (isPending) return <>Loading...</>;
  if (isError) {
    return <>An error occurred while fetching photos: {error.message}</>;
  }

  return (
    <Stack>
      {favorites.length === 0 ? (
        <Typography variant="subtitle1">No Mentions.</Typography>
      ) : (
        favorites.map(
          (
            { _id, file_name, user_id, },
            index
          ) => {
            return (
              <div key={_id || index} className="userdetail-mentions">
                <Button
                  component={HashLink}
                  to={
                    advancedEnabled
                      ? `/photos/${user_id}/${_id}`
                      : `/photos/${user_id}#${_id}`
                  }
                  // prevenet Button style overrides
                  sx={{
                    textTransform: "none",
                    fontSize: "16px",
                    color: "black",
                    gap: "1rem",
                    textAlign: "unset",
                    display: "flex",
                    justifyContent: "start",
                    width: "20vw",
                  }}
                >
                  <ImageList className="userphotos-imagelist" cols={1}>
                    <ImageListItem
                      src={`/images/${file_name}`}
                      alt={`${file_name}`}
                    >
                      <img
                        className="user-comment-link"
                        src={`/images/${file_name}`}
                        alt={`${file_name}`}
                        loading="lazy"
                      />
                    </ImageListItem>
                  </ImageList>
                </Button>
                <div>
                  <Link to={`/users/${user_id}`}>
                    <Typography variant="subtitle1">
                      {user_id}
                    </Typography>
                  </Link>
                  <Divider />
                </div>
              </div>
            );
          }
        )
      )}
    </Stack>
  );
}

export default Favorites;
