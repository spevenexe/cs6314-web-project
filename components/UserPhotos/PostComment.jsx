import React from "react";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "./styles.css";
import formatDate, { parseComment } from "../../api/lib";
import { useLogin } from "../../api/store";
import { deleteComment } from "../../api/comments";

// simple wrapper for each comment
function PostComment({ date_time, comment, user, comment_id }) {
  // you should be able to delete the comment if you are the uploader
  const { token } = useLogin();
  const queryClient = useQueryClient();
  const { isError, isPending, isSuccess, mutate, error } = useMutation({
    mutationFn: deleteComment,
    onSuccess: ({ user_id }) => {
      // we need to refetch data for this user
      queryClient.invalidateQueries(user_id);
    },
  });

  const handleDelete = (event) => {
    event.preventDefault();

    mutate(comment_id);
  };

  const formattedDate = formatDate(date_time);
  const [matches, nonMatches] = parseComment(comment);
  const arrMatches = [];
  for (const match of matches) {
    const formattedMention = `${match[1]}`;
    arrMatches.push(<Link to={`/users/${match[2]}`}>{formattedMention}</Link>);
  }

  const formattedComment = [nonMatches[0]];
  for (let i = 0; i < arrMatches.length; ++i) {
    formattedComment.push(arrMatches[i]);
    formattedComment.push(nonMatches[i + 1]);
  }

  if (isPending) return <Typography variant="subtitle1">Deleting Comment...</Typography>;
  if (isError) return <Typography variant="subtitle1">{error.message}</Typography>;
  if (isSuccess) return <Typography variant="subtitle1">Comment Deleted</Typography>;

  return (
    <div className="comment-container">
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
        {token === user._id && (
          <Button size="small" color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </Typography>
    </div>
  );
}

export default PostComment;
