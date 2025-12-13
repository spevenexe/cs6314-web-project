import React, { useEffect, useState } from "react";
import { ImageList, ImageListItem, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import formatDate from "../../api/lib";
import "./styles.css";
import { addFavorite, getFavorites, removeFavorite } from "../../api/api";

// the post image and upload time
function PostImage({ file_name, date_time, photoId }) {
  const formattedDate = formatDate(date_time);

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
  const [isFavorite, setIsFavorite] = useState(favoriteIds.includes(photoId));

  useEffect(() => {
    setIsFavorite(favoriteIds.includes(photoId));
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
          <IconButton className="favorite-btn" aria-label="favorite" onClick={handleFavorite}>
            {isFavorite ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon sx={{ color: 'red' }} />}
          </IconButton>

        </ImageListItem>
      </ImageList>


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