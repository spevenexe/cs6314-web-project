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
    .catch(() => console.error(`An error occurred while fetching user data for ${userId}`)
    );
}

/**
 * Get the data of the specified user.
 * @param {string} userId
 * @returns
 */
export async function getUser(userId) {
  // we do the error check here to prevent useQuery from constantly trying to re-fetch
  if (!userId) throw new Error("No ID supplied");

  const response = await axios.get(`http://localhost:3001/user/${userId}`);

  if (response.status !== 200) throw new Error(`error fetching user ${response.data}`);

  return response.data;
}

/**
 * 
 * @returns The list of all users
 */
export async function getUserList() {
  const response = await axios.get("http://localhost:3001/user/list");

  if (response.status !== 200) throw new Error(`error fetching user ${response.data}`);

  return response.data;
}

/**
 * Fetch all photos from the database that match the given user ID.
 * @param {string} userId
 * @returns A promise with error configurations that returns the list of photos.
 */
export async function getPhotos(userId) {
  const response = await axios.get(
    `http://localhost:3001/photosOfUser/${userId}`
  );

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while fetching the photos: ${response.data}`
    );
  }

  return response.data;
}

/**
 * Fetch all comments made by a particular user
 * @param {string} userId 
 * @returns 
 */
export async function getComments(userId) {
  const response = await axios.get(
    `http://localhost:3001/commentsOfUser/${userId}`
  );

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while fetching the photos: ${response.data}`
    );
  }

  return response.data;
}
