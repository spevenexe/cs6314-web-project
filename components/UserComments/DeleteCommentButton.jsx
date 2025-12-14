import React, { useState } from "react";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteComment } from "../../api/comments";

export default function DeleteCommentButton({ comment_id }) {
  const [buttonState, setButtonState] = useState("delete");

  const queryClient = useQueryClient();
  const { isError, isPending, isSuccess, mutate, error } = useMutation({
    mutationFn: deleteComment,
    onSuccess: ({ user_id }) => {
      // we need to refetch data for this user
      queryClient.invalidateQueries(user_id);
    },
  });

  const confirmDelete = (event) => {
    event.preventDefault();
    if (buttonState === "delete") {
      setButtonState("confirm");
    } else {
      mutate(comment_id);
    }
  };

  const unconfirmDelete = (event) => {
    event.preventDefault();
    setButtonState("delete");
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
      <Button size="small" color="error" onClick={confirmDelete}>
        {buttonState}
      </Button>
      {buttonState === "confirm" && (
        <Button size="small" onClick={unconfirmDelete}>
          Cancel
        </Button>
      )}
    </>
  );
}
