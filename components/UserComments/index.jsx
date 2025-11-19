import React from "react";
import { List, Typography } from "@mui/material";

import "./styles.css";
import UserCommentLink from "./UserCommentLink";
import {
  getComments,
  getUser,
} from "../../api/api";
import { useQuery } from "@tanstack/react-query";

function UserComments({ userId, setContext, advancedFeatures }) {
  // fetch comments
  const {
    isPending: isCommentsPending,
    isError: isCommentsError,
    data: comments,
    error: commentsError,
  } = useQuery({
    queryKey: ["userComments", userId],
    queryFn: () => getComments(userId),
  });

  // update the topbar context
  const {
    isPending: isUserPending,
    isError: isUserError,
    data: userData,
    error: userError,
  } = useQuery({
    queryKey: ["userContext", userId],
    queryFn: () =>
      getUser(userId).then((userData) => {
        const name = `${userData.first_name} ${userData.last_name}`;
        const _pageType = "comment";
        const context = {
          userId: userData._id,
          name: name,
          pageType: _pageType,
        };
        setContext(context);
        return userData;
      }),
  });

  // check the state of the promise
  if (isCommentsPending || isUserPending) return <>Loading...</>;
  if (isCommentsError)
    return (
      <>An error occurred while fetching comments: {commentsError.message}</>
    );
  if (isUserError)
    return <>An error occurred while fetching user data: {userError.message}</>;

  if (!advancedFeatures) {
    return (
      <Typography variant="h5">
        This page is only available when &quot;Advanced Features&quot; is
        enabled
      </Typography>
    );
  } else {
    return (
      <List>
        {comments.map((item, _idx) => (
          <UserCommentLink
            key={item._id || _idx}
            date_time={item.date_time}
            comment={item.comment}
            user={item.user}
            photo={item.photo}
          />
        ))}
      </List>
    );
  }
}

export default UserComments;
