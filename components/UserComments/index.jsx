import React, { useEffect, useState } from "react";
import { List, Typography } from "@mui/material";

import "./styles.css";
import UserCommentLink from "./UserCommentLink";
import { getComments, setUserContext } from "../../api/api";

function UserComments({ userId, setContext, advancedFeatures }) {
  const [comments, setComments] = useState([]);

  // fetch comments
  useEffect(() => {
    getComments(userId)
      .then(({ok, commentsData}) => {
        if (!ok) return;
        setComments(commentsData);
      });
  }, [userId]);

  // set the context of the top bar
  useEffect(() => {
    setUserContext(userId, setContext, "comment");
  }, [userId]);

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
