import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import formatDate from "../../api/lib";

// simple wrapper for each comment
function PostComment({ date_time, comment, user }) {
  const formattedDate = formatDate(date_time);

  return (
    <div className="comment-container">
      <Typography className="comment-title" variant="subtitle2">
        {/* Links the the user profile */}
        <Link className="comment-userlink" to={`/users/${user._id}`}>
          <b>
            {user.first_name} {user.last_name}
          </b>
        </Link>{" "}
        {formattedDate}
      </Typography>
      <Typography variant="body1">{comment}</Typography>
    </div>
  );
}

export default PostComment;
