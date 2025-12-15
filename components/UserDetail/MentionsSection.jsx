import React, { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import { useAdvancedFeature, usePageStore } from "../../lib/store";
import socket from "../../api/socket";
import { getMentions } from "../../api/comments";
import PostComment from "../UserPhotos/PostComment";

function Mention({
  comment,
  comment_id,
  comment_post_time,
  photo,
  user
}) {
  const { advancedEnabled } = useAdvancedFeature();

  const photo_id = photo._id;
  const { _id: uploader_id, first_name: uploader_first_name, last_name: uploader_last_name } = photo.uploader;
  const file_name = photo.file_name;

  return (
    <div className="userdetail-mentions" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>

      <Button
        component={HashLink}
        to={advancedEnabled ? `/photos/${uploader_id}/${photo_id}` : `/photos/${uploader_id}#${photo_id}`}
        sx={{
          textTransform: "none",
          padding: 0,
          minWidth: 0,
        }}
      >
        <img
          src={`/images/${file_name}`}
          alt={file_name}
          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
          loading="lazy"
        />
      </Button>
      <div>
        <div style={{ display: 'flex', gap: '1rem', margin: '0.5rem'}}>
          <Link to={`/users/${uploader_id}`}>
            <Typography variant="subtitle1">
              {uploader_first_name} {uploader_last_name}
            </Typography>
          </Link>

          <Button
            component={HashLink}
            to={advancedEnabled ? `/photos/${uploader_id}/${photo_id}#${comment_id}` : `/photos/${uploader_id}#${comment_id}`}
            size="small"
            variant="outlined"
          >
            JUMP TO COMMENT
          </Button>
        </div>

        <Divider sx={{ my: 1 }} />

        <PostComment
          key={comment_id}
          date_time={comment_post_time}
          comment={comment}
          user={user}
          comment_id={comment_id}
          isOnPhotosPage={false}
        />
      </div>

    </div>
  );
}

export default function MentionsSection() {
  const { userId } = usePageStore();

  const queryClient = useQueryClient();

  // mentions list
  const {
    data: data_mentions,
    isPending: isMentionsPending,
    isError: isMentionsError,
    error: mentionsError,
  } = useQuery({
    queryKey: ["mention", userId],
    queryFn: async () => {
      const _mentions = await getMentions({ userId });
      return _mentions;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // subscribe to socket event for mentions
  useEffect(() => {
    // if (!socket.connected) {
    //   return () => { };
    // }
    socket.emit("joinUserRoom", userId);

    const handleNewMention = (mention) => {
      console.log("SOCK IT");
      console.log(mention);
      queryClient.invalidateQueries({ queryKey: ["mention", userId] });
    };


    socket.on("newMention", handleNewMention);

    return () => {
      socket.off("newMention", handleNewMention);
      socket.emit("leaveUserRoom", userId);
    };
  }, [userId]);

  if (isMentionsPending) return <>Loading...</>;
  if (isMentionsError) {
    return (
      <>
        An error occurred while fetching the database: {mentionsError.message}
      </>
    );
  }

  return (
    <Box>
      <Typography variant="h3">Mentions</Typography>
      <Divider />
      <div className="userdetail-mentions-container">
        {data_mentions.length === 0 ? (
          <Typography variant="subtitle1">No Mentions.</Typography>
        ) : (
          data_mentions.map(({ _id, comment, date_time, photo, user }, index) => {
            return (
              <Box key={_id ?? index} sx={{ mb: 2 }}>
                <Mention
                  comment={comment}
                  comment_id={_id}
                  comment_post_time={date_time}
                  photo={photo}
                  user={user}
                />
                {index !== data_mentions.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            );
          })
        )}
      </div>
    </Box>
  );
}
