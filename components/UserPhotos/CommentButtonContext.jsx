import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { Mention, MentionsInput } from "react-mentions";
import { useComment } from "../../lib/store";
import { postComment, getUserList } from "../../api/api";

import mentionInputStyle from "./mentionInputStyle";
import { parseComment } from "../../lib/util.jsx";

function CommentButtonContext({ photoId }) {
  const [commentBody, setCommentBody] = useState("");

  const {
    addingComment,
    photoId: photoIdStore,
    setAddComment,
    unsetAddComment,
  } = useComment();

  const queryClient = useQueryClient();

  const {
    // status,
    isError,
    isLoading,
    error,
    mutate: submitComment,
  } = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      unsetAddComment();

      queryClient.invalidateQueries({
        queryKey: ["userPhotos"],
      });
    },
  });

  const {
    isPending_users,
    isError_users,
    data: users,
    error_users,
  } = useQuery({
    queryKey: ["userList"],
    queryFn: getUserList,
  });

  if (isPending_users) return <>Loading...</>;
  if (isError_users) {
    return <>An error occurred while fetching the database: {error_users.message}</>;
  }

  const uploadComment = (e) => {
    e.preventDefault();

    const matches = parseComment(commentBody)[0];
    const ids = matches.map(item => item[2]);
    
    submitComment({ photo_id: photoId, comment: commentBody, mentions: ids });
    setCommentBody("");    
  };

  if (addingComment && photoId === photoIdStore) {
    return (
      <Box component="form" onSubmit={uploadComment} sx={{ mt: 2 }}>
        {isError && (
          <Typography color="error" variant="body2">
            {error.response.data}
          </Typography>
        )}

        <MentionsInput
          value={commentBody}
          style={mentionInputStyle}
          onChange={(e) => {setCommentBody(e.target.value);}}>
          <Mention
            data={users.map(item => ({
                display: `@${item.first_name} ${item.last_name}`,
                id: item._id
              }))} />
        </MentionsInput>

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
      <Button
        variant="contained"
        onClick={() => setAddComment(photoId)}
        sx={{ mt: 2 }}
      >
        Add Commment +
      </Button>
    );
  }
}

export default CommentButtonContext;
