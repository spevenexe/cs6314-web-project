import React from "react";
import { Link } from "react-router-dom";
import { Button, ImageList, ImageListItem, Typography } from "@mui/material";

import "./styles.css";
import formatDate from "../../api/lib";

/**
 * We redefine the inner comment here to prevent the nesting of anchor tags
 */
function NoLinkComment({ date_time, comment, user }) {
  const formattedDate = formatDate(date_time);

  return (
    <div className="comment-container">
      <Typography className="comment-title" variant="subtitle2">
          <b>
            {user.first_name} {user.last_name}
          </b>
        {formattedDate}
      </Typography>
      <Typography variant="body1">{comment}</Typography>
    </div>
  );
}

function UserCommentLink({ comment, date_time, user, photo }) {
  const file_name = photo.file_name;

  return (
    <Button
      component={Link}
      to={`/photos/${photo.user_id}/${photo._id}`}
      // prevenet Button style overrides
      sx={{
        textTransform: "none",
        fontSize: "16px",
        color: "black",
        gap: "1rem",
        textAlign: "unset",
        display: "flex",
        justifyContent: "start",
        width: "100%",
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
      <NoLinkComment date_time={date_time} comment={comment} user={user} />
    </Button>
  );
}

export default UserCommentLink;
