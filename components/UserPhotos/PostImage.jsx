import React from "react";
import { ImageList, ImageListItem, Typography } from "@mui/material";
import formatDate from "../../api/lib";

import "./styles.css";

// the post image and upload time
function PostImage({ file_name, date_time }) {
  const formattedDate = formatDate(date_time);

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