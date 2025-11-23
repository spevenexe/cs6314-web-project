import React from "react";
import { Button, Box, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useComment } from "../../api/store";
import { postComment } from "../../api/api";

function CommentButtonContext({ photoId }) {
  const {
    addingComment,
    photoId: photoIdStore,
    setAddComment,
    unsetAddComment,
  } = useComment();

  const queryClient = useQueryClient();

  const {
    status,
    isError,
    isLoading,
    error,
    mutate: submitComment,
  } = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      unsetAddComment();

      queryClient.invalidateQueries({
        queryKey: ["userPhotos"]
      });
    },
  });

  const uploadComment = (e) => {
    e.preventDefault();

    submitComment({ photo_id: photoId, comment: e.target[0].value });
  };

  if (addingComment && photoId === photoIdStore) {
    return (
      <Box component="form" onSubmit={uploadComment} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Comment"
          // value={"Add Comment here..."}
          margin="normal"
        />

        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
          sx={{ mt: 2, mr: 2 }}
        >
          Post
        </Button>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          color="error"
          onClick={() => unsetAddComment()}
        >
          Cancel
        </Button>
      </Box>
    );
  } else {
    return (
      <Button variant="contained" onClick={() => setAddComment(photoId)}>
        Add Commment +
      </Button>
    );
  }
}

export default CommentButtonContext;
