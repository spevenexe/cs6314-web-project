import React, { useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
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

import { PageType } from "../../lib/util.jsx";
import { useAdvancedFeature, useLogin, usePageStore } from "../../lib/store";
import "./styles.css";
import ButtonSwap from "../common/ButtonSwap";
import { getUser } from "../../api/user.js";
import { getPhotosByMention } from "../../api/photo.js";
import socket from "../../api/socket";
import DangerZone from "./DangerZone.jsx";

function UserDetail({ userId }) {
  //advanced features
  const { advancedEnabled } = useAdvancedFeature();
  const {token} = useLogin();

  // fetch the user details
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userDetail", userId],
    queryFn: () => getUser(userId),
  });

  // update user detail context
  const UpdatePageStore = usePageStore((state) => state.UpdatePageStore);
  useEffect(() => {
    UpdatePageStore(userId, PageType.DETAIL);
  }, [userId]);

  // mentions list
  const {
    data: data_mentions,
    isPending: isMentionsPending,
    isError: isMentionsError,
    error: mentionsError,
  } = useQuery({
    queryKey: ["mention", userId],
    queryFn: async () => {
      const mentions = await getPhotosByMention({ user_id: userId });
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
    });

    return () => {
      socket.off("newMention");
    };
  }, []);

  if (isPending || isMentionsPending) return <>Loading...</>;
  if (isError) {
    return <>An error occurred while fetching the database: {error.message}</>;
  }
  if (isMentionsError) {
    return (
      <>
        An error occurred while fetching the database: {mentionsError.message}
      </>
    );
  }

  return (
    <>
      <ButtonSwap userId={userId} pageType={"detail"} />
      <div>
        <Typography variant="h2">
          {data?.first_name} {data?.last_name}
        </Typography>
        <Typography variant="subtitle1">
          <b>Location:</b> {data?.location}. <b>Occupation:</b>{" "}
          {data?.occupation}
        </Typography>
        <Divider />
        <Typography sx={{ my: 5 }} variant="body1">
          {data?.description}
        </Typography>
        <Typography variant="h3">Mentions</Typography>
        <Divider />
        <div className="userdetail-mentions-container">
          {data_mentions.length === 0 ? (
            <Typography variant="subtitle1">No Mentions.</Typography>
          ) : (
            data_mentions.map(
              (
                {
                  _id,
                  file_name,
                  user_id: { _id: uid, first_name, last_name },
                },
                index
              ) => {
                return (
                  <div key={_id || index} className="userdetail-mentions">
                    <Button
                      component={HashLink}
                      to={
                        advancedEnabled
                          ? `/photos/${uid}/${_id}`
                          : `/photos/${uid}#${_id}`
                      }
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
                        <ImageListItem
                          src={`/images/${file_name}`}
                          alt={`${file_name}`}
                        >
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
                      <Link to={`/users/${uid}`}>
                        <Typography variant="subtitle1">
                          {first_name} {last_name}
                        </Typography>
                      </Link>
                      <Divider />
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>
        {token === userId && <DangerZone/>}
      </div>
    </>
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserDetail;
