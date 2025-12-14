import React from "react";
import { Button, styled } from "@mui/material";
import { Box } from "@mui/system";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "./styles.css";
import { useUpload } from "../../lib/store";
import { uploadPhoto } from "../../api/api";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function PhotoUpload() {
  const { uploadInput: inputFile, setUpload} = useUpload();


  const queryClient = useQueryClient();

  const { isError, isPending, mutate, error, isSuccess } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: ({ user_id }) => {
      // we need to refetch the photos of this user
      queryClient.invalidateQueries(user_id);
      setUpload(null);
    },
  });

  const handleUpload = (event) => {
    event.preventDefault();

    if (inputFile) {
      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append("uploadedphoto", inputFile);

      mutate(domForm);
    }
  };

  let file_text = "";
  if (inputFile) file_text = inputFile.name;
  else if (isSuccess) file_text = "Photo Uploaded ✓";
  else if (isError) file_text = error.message;
  else if (isPending) file_text = "Loading...";

  return (
    <Box component="form" onSubmit={handleUpload}>
      <Button
        color="warning"
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon="+"
        sx={{ mr: 2 }}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={(event) => setUpload(event.target.files[0])}
          multiple
        />
      </Button>
      {file_text}
      <Button
        variant="contained"
        type="submit"
        color="secondary"
        // disabled={isLoading}
        sx={{ ml: 2 }}
      >
        Post
      </Button>
    </Box>
  );
}

export default PhotoUpload;
