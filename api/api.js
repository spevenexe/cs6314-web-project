/**
 * This file contains common fetching patterns used between multiple components
 */

import axios from "axios";

/**
 * Sets the context of the top bar page by querying the database on current user ID.
 * @param {number} userId 
 * @param {Function} setContext the useState setter function for the context
 * @param {string} pageType a string literal that determines what should be displayed in the top bar.
 * @returns A promise that has been configured to set the context and return the userdata object from the server's response.
 */
export function setUserContext(userId, setContext, pageType) {
  let response = axios.get(`http://localhost:3001/user/${userId}`);

  return response
    .catch((err) => {
      console.error(err.response.data);
    })
    .then((res) => {
      let userData = res.data;
      const name = `${userData.first_name} ${userData.last_name}`;
      const _pageType = pageType;
      const context = {
        userId: userData._id,
        name: name,
        pageType: _pageType,
      };
      setContext(context);
      return userData;
    })
    .catch(() => console.error(`An error occurred while fetching user data for ${userId}`));
}

/**
 * Fetch all photos from the database that match the given user ID.
 * @param {number} userId 
 * @returns A promise with error configurations that returns the list of photos.
 */
export function getPhotos(userId) {
  let response = axios.get(
    `http://localhost:3001/photosOfUser/${userId}`
  );

  // get all photos
  return response
    .catch((err) => {
      console.error(err.response.data);
      return {ok: false};
    })
    .then((res) => {
      if (res.ok === false) return {ok: false};

      return { ok: true, photosData: res.data  };
    });
}

export function getComments(userId) {
  let response = axios.get(
    `http://localhost:3001/commentsOfUser/${userId}`
  );

  // get all comments of the user
  return response
    .catch((err) => {
      console.error(err.response.data);
      return {ok: false};
    })
    .then((res) => {
      if (res.ok === false) return {ok: false};

      return { ok: true, commentsData: res.data  };
    });
}

