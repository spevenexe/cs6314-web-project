import React, { useEffect } from "react";
import { List, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import "./styles.css";
import UserCommentLink from "./UserCommentLink";
import { getComments} from "../../api/comments.js";
import { useAdvancedFeature, usePageStore } from "../../lib/store";
import { PageType } from "../../lib/util.jsx";

function UserComments({ userId }) {
  const UpdatePageStore = usePageStore((state) => state.UpdatePageStore);
  const {advancedEnabled} = useAdvancedFeature();
  
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
  useEffect(() => {UpdatePageStore(userId,PageType.COMMENT);}, [userId]);
  // useEffect(() => {usePageStore.setState({userId:userId,pageType:PageType.COMMENT});}, [userId]);

  // check the state of the promise
  if (isCommentsPending) return <>Loading...</>;
  if (isCommentsError) {
    return (
      <>An error occurred while fetching comments: {commentsError.message}</>
    );
  }
  
  if (!advancedEnabled) {
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
            comment_id={item._id}
          />
        ))}
      </List>
    );
  }
}

export default UserComments;
