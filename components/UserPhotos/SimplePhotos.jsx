import React from "react";

import "./styles.css";
import Post from "./Post";

// A simple downward stretching list of each post
function SimplePhotos({ photos }) {
  return (
    <div>
      {photos.map((item, index) => (
        <Post
          key={item._id || index}
          file_name={item.file_name}
          date_time={item.date_time}
          comments={item.comments}
        />
      ))}
    </div>
  );
}

export default SimplePhotos;