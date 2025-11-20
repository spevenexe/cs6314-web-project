import React, { useEffect } from "react";
import { List, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import "./styles.css";
import UserCommentLink from "./UserCommentLink";
import { getComments} from "../../api/api";
import { usePageStore } from "../../api/store";
import { PageType } from "../../api/lib";

function UserComments({ userId, advancedFeatures }) {
  const UpdatePageStore = usePageStore((state) => state.UpdatePageStore);
  // const {UpdatePageStore} = usePageStore();
  
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
