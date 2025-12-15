import React, { useState } from "react";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteComment } from "../../api/comments";
import DeleteButtonState from "../../lib/deleteButtonState";

export default function DeleteCommentButton({ comment_id }) {
  const [buttonState, setButtonState] = useState(DeleteButtonState.DELETE);

  const queryClient = useQueryClient();
  const { isError, isPending, isSuccess, mutate, error } = useMutation({
    mutationFn: deleteComment,
    onSuccess: ({ user_id }) => {
      // we need to refetch data for this user
      queryClient.invalidateQueries(user_id);
      queryClient.invalidateQueries({ queryKey: ["commentCount", user_id] });
    },
  });

  const confirmDelete = (event) => {
    event.preventDefault();
    if (buttonState === DeleteButtonState.DELETE) {
      setButtonState(DeleteButtonState.CONFIRM);
    } else {
      setButtonState(DeleteButtonState.DELETED);
      setTimeout(() => mutate(comment_id), 250);
    }
  };

  const unconfirmDelete = (event) => {
    event.preventDefault();
    setButtonState(DeleteButtonState.DELETE);
  };

  if (isPending) {
    return "Deleting Comment...";
  }
  if (isError) {
    return `${error.message}`;
  }
  if (isSuccess) {
    return "Comment Deleted";
  }

  return (
    <>
      <Button size="small" color="error" onClick={confirmDelete} disabled={buttonState === DeleteButtonState.DELETED}>
        {buttonState}
      </Button>
      {buttonState === DeleteButtonState.CONFIRM && (
        <Button size="small" onClick={unconfirmDelete}>
          Cancel
        </Button>
      )}
    </>
  );
}
