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

  console.log(comments);

  return (
    <div className="userphotos-post">
      <PostImage file_name={file_name} date_time={date_time} />
      {comments.map((item, index) => (
        <PostComment
          key={`${file_name}-${index}`}
          date_time={item.date_time}
          comment={item.comment}
          user={item.user}
        />
      ))}
      <CommentButtonContext photoId={photoId}/>
    </div>
  );
}

export default Post;
