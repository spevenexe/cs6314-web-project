import React, { useState } from "react";
import { Button, Dialog, Divider, ImageList, ImageListItem, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./styles.css";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { getFavorites, removeFavorite } from "../../api/favorite";

/**
 * Advanced element. Features bubbles for photo counts and comment counts
 * */
function Favorites() {
  const [openPhoto, setOpenPhoto] = useState(null);

  const queryClient = useQueryClient();

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

  const {
    // status,
    // isError,
    // isLoading,
    // error,
    mutate: unfavorite,
  } = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favoritesList"],
      });
    },
  });

  // check the state of the promise
  if (isPending) return <>Loading...</>;
  if (isError) {
    return <>An error occurred while fetching photos: {error.message}</>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight="bold">
        Favorite Photos
      </Typography>

      <Divider />

      {favorites.length === 0 ? (
        <Typography color="text.secondary">
          You haven’t favorited any photos yet.
        </Typography>
      ) : (
        <ImageList cols={4} gap={12}>
          {favorites.map((photo) => (
            <ImageListItem
              key={photo._id}
              className="favorite-thumbnail"
              onClick={() => setOpenPhoto(photo)}
            >
              <img
                src={`/images/${photo.file_name}`}
                alt={photo.file_name}
                loading="lazy"
                className="thumbnail-image"
              />

              <Button
                size="small"
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  unfavorite(photo._id);
                }}
                className="unfavorite-button"
              >
                <HeartBrokenIcon fontSize="small" />
              </Button>
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* Modal */}
      <Dialog
        open={Boolean(openPhoto)}
        onClose={() => setOpenPhoto(null)}
        maxWidth="md"
        fullWidth
      >
        {openPhoto && (
          <Stack spacing={2} p={2}>
            <img
              src={`/images/${openPhoto.file_name}`}
              alt={openPhoto.file_name}
              className="modal-image"
            />


            <Typography variant="body2" color="text.secondary" align="center">
              {new Date(openPhoto.date_time).toLocaleString()}
            </Typography>
          </Stack>
        )}
      </Dialog>
    </Stack>
  );
}

export default Favorites;
