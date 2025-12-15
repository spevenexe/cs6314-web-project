import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import { useAdvancedFeature, usePageStore } from "../../lib/store";
import socket from "../../api/socket";
import { getMentions } from "../../api/comments";

function Mention({
  comment,
  comment_id,
  comment_post_time,
  photo,
  user
}) {
  const { advancedEnabled } = useAdvancedFeature();

  const photo_id = photo._id;
  const {_id: uploader_id, first_name: uploader_first_name, last_name: uploader_last_name} = photo.uploader;
  const file_name = photo.file_name;

  return (
    <div className="userdetail-mentions">
      <Button
        component={HashLink}
        to={advancedEnabled ? `/photos/${uploader_id}/${photo_id}` : `/photos/${uploader_id}#${photo_id}`}
        // prevenet Button style overrides
        sx={{
          textTransform: "none",
          fontSize: "16px",
          color: "black",
          gap: "1rem",
          textAlign: "unset",
          display: "flex",
          justifyContent: "start",
          width: "20vw",
        }}
      >
        <ImageList className="userphotos-imagelist" cols={1}>
          <ImageListItem src={`/images/${file_name}`} alt={`${file_name}`}>
            <img
              className="user-comment-link"
              src={`/images/${file_name}`}
              alt={`${file_name}`}
              loading="lazy"
            />
          </ImageListItem>
        </ImageList>
      </Button>
      <div>
        <Link to={`/users/${uploader_id}`}>
          <Typography variant="subtitle1">
            {uploader_first_name} {uploader_last_name}
          </Typography>
        </Link>
        <Divider />
      </div>
    </div>
  );
}

export default function MentionsSection() {
  const { userId } = usePageStore();
  const {mentionsState, setMentionsState} = useState([]);

  // mentions list
  const {
    data: data_mentions,
    isPending: isMentionsPending,
    isError: isMentionsError,
    error: mentionsError,
  } = useQuery({
    queryKey: ["mention", userId],
    queryFn: async () => {
      const mentions = await getMentions({userId});
      return mentions;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // subscribe to socket event for mentions
  useEffect(() => {
    socket.on("newMention", ({ newComment, photo }) => {
      console.log(newComment);
      console.log(photo);
      // setMentionsState(mentions => [...mentions,newComment]);
    });

    return () => {
      socket.off("newMention");
    };
  }, []);

  if (isMentionsPending) return <>Loading...</>;
  if (isMentionsError) {
    return (
      <>
        An error occurred while fetching the database: {mentionsError.message}
      </>
    );
  }

  console.log(data_mentions);

  return (
    <>
      <Typography variant="h3">Mentions</Typography>
      <Divider />
      <div className="userdetail-mentions-container">
        {data_mentions.length === 0 ? (
          <Typography variant="subtitle1">No Mentions.</Typography>
        ) : (
          data_mentions.map(({ _id, comment, date_time, photo, user }, index) => {
            return (
              <Mention
                key={_id ?? index}
                comment={comment}
                comment_id={_id}
                comment_post_time={date_time}
                photo={photo}
                user={user}
              />
            );
          })
        )}
      </div>
    </>
  );
}
