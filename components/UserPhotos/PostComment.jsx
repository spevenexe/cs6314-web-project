import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import formatDate, { parseComment } from "../../api/lib";

// simple wrapper for each comment
function PostComment({ date_time, comment, user }) {
  const formattedDate = formatDate(date_time);
  const [matches, nonMatches] = parseComment(comment);
  const arrMatches = [];
  for (const match of matches) {
    const formattedMention = `${match[1]}`;
    arrMatches.push(<Link to={`/users/${match[2]}`}>{formattedMention}</Link>);
  }

  const formattedComment = [nonMatches[0]];
  for (let i = 0; i < arrMatches.length; ++i){
    formattedComment.push(arrMatches[i]);
    formattedComment.push(nonMatches[i+1]);
  }


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
      <Typography variant="body1">{formattedComment}</Typography>
    </div>
  );
}

export default PostComment;
