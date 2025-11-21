/**
 * This file contains common fetching patterns used between multiple components
 */

import axios from "axios";

const api = axios.create({
  baseURL:'http://localhost:3001',
  withCredentials:true,
});

/**
 * Get the data of the specified user.
 * @param {string} userId
 * @returns
 */
export async function getUser(userId) {
  // we do the error check here to prevent useQuery from constantly trying to re-fetch
  if (!userId) throw new Error("No ID supplied");

  const response = await api.get(`/user/${userId}`);

  if (response.status !== 200) throw new Error(`error fetching user ${response.data}`);

  return response.data;
}

/**
 * 
 * @returns The list of all users
 */
export async function getUserList() {
  const response = await api.get("/user/list");

  if (response.status !== 200) throw new Error(`error fetching user ${response.data}`);

  return response.data;
}

/**
 * Fetch all photos from the database that match the given user ID.
 * @param {string} userId
 * @returns A promise with error configurations that returns the list of photos.
 */
export async function getPhotos(userId) {
  const response = await api.get(
    `/photosOfUser/${userId}`
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
  const response = await api.get(
    `/commentsOfUser/${userId}`
  );

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while fetching the photos: ${response.data}`
    );
  }

  return response.data;
}

/**
 * //TODO
 */
export async function loginRequest({ login_name }) {
  const response = await api.post(
    `/admin/login`,
    { login_name: login_name },
  );

  if (response.status === 400) {
    throw new Error(
      `${response.data}`
    );
  }

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while trying to login: ${response.data}`
    );
  }

  return response.data;
}

/**
 * //TODO
 */
export async function logoutRequest() {
  const response = await api.post(
    `/admin/logout`
  );

  if (response.status === 400) {
    throw new Error(
      `An error occurred while trying to logout: ${response.data}`
    );
  }

  return response.data;
}
