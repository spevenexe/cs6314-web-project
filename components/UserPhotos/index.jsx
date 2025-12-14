import React, { useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

import "./styles.css";

import ButtonSwap from "../common/ButtonSwap";
import SimplePhotos from "./SimplePhotos";
import AdvancedPhotos from "./AdvancedPhotos";
import { getPhotos, getUser } from "../../api/api";

import { useAdvancedFeature, usePageStore } from "../../lib/store";
import { PageType } from "../../lib/util.jsx";

function UserPhotos({ userId, photoId }) {
  const { advancedEnabled, setAdvancedFeatures } = useAdvancedFeature();

  // If a photo parameter was passed in, we are presumably in the "Advanced" mode
  useEffect(() => {
    if (photoId && !advancedEnabled) setAdvancedFeatures(true);
  }, [photoId]);

  // set the context of the top bar
  const {
    isPending: isUserPending,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ["userContext"],
    queryFn: () => getUser(userId),
  });

  // update photo context
  const UpdatePageStore = usePageStore((state) => state.UpdatePageStore);
  useEffect(() => {
    UpdatePageStore(userId, PageType.PHOTO);
  }, [userId]);

  const {
    isPending: isPhotosPending,
    isError: isPhotosError,
    data: photos,
    error: photosError,
  } = useQuery({
    queryKey: ["userPhotos", userId],
    queryFn: () => getPhotos(userId),
  });

  // check the state of the promise
  if (isUserPending || isPhotosPending) return <>Loading...</>;
  if (isUserError) {
    return <>An error occurred while fetching user data: {userError.message}</>;
  }
  if (isPhotosError) {
    return <>An error occurred while fetching photos: {photosError.message}</>;
  }

  if (!advancedEnabled) {
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
};

export default UserPhotos;
