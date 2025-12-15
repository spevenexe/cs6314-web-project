import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import formatDate, { createCommentWithMentions, getCommentMatches } from "../../lib/util.jsx";
import { useLogin } from "../../lib/store";
import DeleteCommentButton from "../UserComments/DeleteCommentButton.jsx";

// simple wrapper for each comment
function PostComment({ date_time, comment, user, comment_id, isOnPhotosPage=true }) {
  // you should be able to delete the comment if you are the uploader
  const { token } = useLogin();

  const formattedDate = formatDate(date_time);
  const [matches, nonMatches] = getCommentMatches(comment);
  const formattedComment = createCommentWithMentions(matches,nonMatches);

  return (
    <div className="comment-container" id={comment_id}>
      <Typography className="comment-title" variant="subtitle2">
        <Link className="comment-userlink" to={`/users/${user._id}`}>
          <b>
            {user.first_name} {user.last_name}
          </b>
        </Link>{" "}
        {formattedDate}
      </Typography>
      <Typography variant="body1">
        {formattedComment}{" "}
        {token === user._id && isOnPhotosPage && <DeleteCommentButton comment_id={comment_id}/>}
      </Typography>
    </div>
  );
}

export default PostComment;
