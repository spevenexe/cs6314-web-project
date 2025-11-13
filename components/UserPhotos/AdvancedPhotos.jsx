import React from "react";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

import "./styles.css";
import { useNavigate } from "react-router-dom";

import PostComment from "./PostComment";
import PostImage from "./PostImage";

// A page featuring a single photo, and stepper functionality to travers the user's list of photos.
function AdvancedPhotos({ photos, userId, targetId }) {
  const maxSteps = photos.length;
  const navigate = useNavigate();

  let photo = null;
  let i = -1;
  for (i = 0; i < maxSteps; i++) {
    const p = photos[i];
    if (p._id === targetId) {
      photo = p;
      break;
    }
  }

  if (photos.length === 0) {
    return (
      <Typography variant="subtitle1">This user has no photos!</Typography>
    );
  }

  if (!photo) {
    i = 0;
    photo = photos[0];
    window.history.replaceState(null, document.title, `/photos/${userId}/${photo._id}`);
  }

  const prev = (i > 0) ? photos[i - 1]._id : null;
  const next = (i < maxSteps - 1) ? photos[i + 1]._id : null;

  const handleNext = () => {
    navigate(`/photos/${userId}/${next}`);
  };

  const handleBack = () => {
    navigate(`/photos/${userId}/${prev}`);
  };

  const file_name = photo.file_name;
  const date_time = photo.date_time;
  const comments = photo.comments ? photo.comments : []; // empty on null

  return (
    <div className="userphotos-post">
      {/* stepper */}
      <div className="userphotos-advanced-slideshow">
        <Button size="small" onClick={handleBack} disabled={i === 0}>
          {"< Back"}
        </Button>
        <PostImage file_name={file_name} date_time={date_time} />
        <Button
          size="small"
          onClick={handleNext}
          disabled={i === maxSteps - 1}
        >
          {"Next >"}
        </Button>
      </div>

      {comments.map((item, _idx) => (
        <PostComment
          key={item._id || _idx}
          date_time={item.date_time}
          comment={item.comment}
          user={item.user}
        />
      ))}
    </div>
  );
}

export default AdvancedPhotos;