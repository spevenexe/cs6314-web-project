import React, { useEffect, useState } from "react";
import { ImageList, ImageListItem, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import formatDate from "../../lib/util.jsx";
import "./styles.css";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../api/favorite.js";
// import DeletePhotoButton from "./DeletePhotoButton.jsx";
import { useLogin, usePageStore } from "../../lib/store.js";
import DeletePhotoButton from "./DeletePhotoButton.jsx";

// the post image and upload time
function PostImage({ file_name, date_time, photoId }) {
  const {token} = useLogin();
  const formattedDate = formatDate(date_time);
  const {userId} = usePageStore();

  const queryClient = useQueryClient();

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
    mutate: favorite,
  } = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favoritesList"],
      });
    },
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

  const favoriteIds = favorites ?? [];
  const [isFavorite, setIsFavorite] = useState(
    favoriteIds.some((item) => item._id === photoId)
  );

  useEffect(() => {
    setIsFavorite(favoriteIds.some((item) => item._id === photoId));
  }, [favoriteIds, photoId]);

  if (isPending) return <>Loading...</>;
  if (isError) {
    return <>An error occurred while fetching the database: {error.message}</>;
  }
  const handleFavorite = async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    if (next) {
      favorite(photoId);
    } else {
      unfavorite(photoId);
    }
  };

  return (
    <div className="userphotos-image">
      <ImageList className="userphotos-imagelist" cols={1}>
        <ImageListItem
          src={`/images/${file_name}`}
          alt={`${file_name}`}
          sx={{
            maxWidth: "75%",
            margin: "0 auto",
          }}
        >
          <img
            src={`/images/${file_name}`}
            alt={`${file_name}`}
            loading="lazy"
          />
        </ImageListItem>
      </ImageList>
      <div className="userphotos-options">
        <IconButton
          className="favorite-btn"
          aria-label="favorite"
          onClick={handleFavorite}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "red" }} />
          )}
        </IconButton>
        {token === userId && <DeletePhotoButton photo_id={photoId}/>}
      </div>

      <Typography
        variant="subtitle1"
        sx={{
          maxWidth: "75%",
          margin: "0 auto",
        }}
      >
        Uploaded on {formattedDate}
      </Typography>
    </div>
  );
}

export default PostImage;
