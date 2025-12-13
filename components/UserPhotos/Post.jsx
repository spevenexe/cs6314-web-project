import React from "react";

import "./styles.css";

import PostComment from "./PostComment";
import PostImage from "./PostImage";
import CommentButtonContext from "./CommentButtonContext";

/**
 * wrapper for each post
 */
function Post({ file_name, date_time, comments, photoId }) {
  // to handle when comments is null, we convert to empty
  if (!comments) comments = [];

  return (
    <div id={photoId} className="userphotos-post">
      <PostImage file_name={file_name} date_time={date_time} photoId={photoId} />
      {comments.map((item, index) => (
        <PostComment
          key={item._id || index}
          date_time={item.date_time}
          comment={item.comment}
          user={item.user}
          comment_id={item._id}
        />
      ))}
      <CommentButtonContext photoId={photoId} />
    </div>
  );
}

export default Post;
