import React, { useState } from "react";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePhoto } from "../../api/photo";
import DeleteButtonState from "../../lib/deleteButtonState";

export default function DeletePhotoButton({ photo_id }) {
  const [buttonState, setButtonState] = useState(DeleteButtonState.DELETE);

  const queryClient = useQueryClient();
  const { isError, isPending, mutate, error } = useMutation({
    mutationFn: deletePhoto,
    onSuccess: ({ user_id }) => {
      // we need to refetch data for this user
      queryClient.invalidateQueries({ queryKey: ["userPhotos", user_id] });
    },
  });

  const confirmDelete = (event) => {
    event.preventDefault();
    if (buttonState === DeleteButtonState.DELETE) {
      setButtonState(DeleteButtonState.CONFIRM);
    } else {
      setButtonState(DeleteButtonState.DELETED);
      setTimeout(() => mutate(photo_id), 1000);
    }
  };

  const unconfirmDelete = (event) => {
    event.preventDefault();
    setButtonState(DeleteButtonState.DELETE);
  };

  if (isPending) {
    return "Deleting Photo...";
  }
  if (isError) {
    return `${error.message}`;
  }

  if (buttonState === DeleteButtonState.DELETED) {
    return (
      <div className="userphoto-delete-button">
        <Button variant="contained" color="error" disabled>deleted</Button>
      </div>
    );
  }

  return (
    <div className="userphoto-delete-button">
      <Button
        variant="outlined"
        size="small"
        color="error"
        onClick={confirmDelete}
      >
        {buttonState}
      </Button>
      {buttonState === DeleteButtonState.CONFIRM && (
        <Button variant="contained" size="small" onClick={unconfirmDelete}>
          Cancel
        </Button>
      )}
    </div>
  );
}
