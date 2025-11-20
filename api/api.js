/**
 * This file contains common fetching patterns used between multiple components
 */

import axios from "axios";

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

/**
 * 
 */
export async function loginRequest({login_name}) {
  const response = await axios.post(
    `http://localhost:3001/admin/login`,
    {login_name: login_name}
  );
  
  if (response.status === 400) {
    throw new Error(
      `${response.data}`
    );
  }

  if(response.status !== 200) {
    throw new Error(
      `An error occurred while trying to login: ${response.data}`
    );
  }

  return response.data;
}
