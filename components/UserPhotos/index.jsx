import React, { useEffect, useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";

import "./styles.css";

import ButtonSwap from "../common/ButtonSwap";
import SimplePhotos from "./SimplePhotos";
import AdvancedPhotos from "./AdvancedPhotos";
import { getPhotos, setUserContext } from "../../api/api";

function UserPhotos({
  userId,
  photoId,
  setContext,
  advancedFeatures,
  setAdvancedFeatures,
}) {
  const [photos, setPhotos] = useState([]);

  // set the context of the top bar
  useEffect(() => {
    setUserContext(userId, setContext, "photo");
  }, [userId]);

  // Fetch photos belonging to our current user
  useEffect(() => {
    getPhotos(userId)
      .then(({ ok, photosData }) => {
        if (!ok) return;
        setPhotos(photosData);
      })
      .catch(() => {
        console.error("An error occurred while fetching the user photos");
      });
  }, [userId]);

  // If a photo parameter was passed in, we are presumably in the "Advanced" mode
  useEffect(() => {
    if (photoId && !advancedFeatures) setAdvancedFeatures(true);
  }, [photoId]);

  if (!advancedFeatures) {
    return (
      <>
        <ButtonSwap userId={userId} pageType={"photo"} />
        <SimplePhotos photos={photos} />
      </>
    );
  } else {
    return (
      <>
        <ButtonSwap userId={userId} pageType={"photo"} />
        <AdvancedPhotos photos={photos} userId={userId} targetId={photoId} />
      </>
    );
  }
}

UserPhotos.propTypes = {
  userId: PropTypes.string.isRequired,
  setContext: PropTypes.func.isRequired,
};

export default UserPhotos;
