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
 * @returns the id of the currently logged in user
 */
export async function getCurrentUser() {
  const response = await api.post('/user/auth');

  if (response.status === 400) {
    throw new Error(`${response.data}`);
  }

  if (response.status !== 200) {
    throw new Error(`An error occurred while fetching current user`);
  }

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
 * Adds comment to comments of photo photo_id
 * @param {Object} params
 * @param {string} params.photo_id
 * @param {string} params.comment
 * @returns
 */
export async function postComment({photo_id, comment}) {
  const response = await api.post(
    `/commentsOfPhoto/${photo_id}`,
    { comment: comment },
  );


  if (response.status === 400) {
    throw new Error(
      `${response.data}`
    );
  }

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while trying to post comment: ${response.data}`
    );
  }

  return response.data;
}

/**
 * Registers new user
 * @param {Object} userData
 * @param {string} userData.login_name
 * @param {string} userData.password
 * @param {string} userData.first_name
 * @param {string} userData.last_name
 * @param {string} [userData.location]
 * @param {string} [userData.description]
 * @param {string} [userData.occupation]
 * @returns
 */
export async function registerUser(userData) {
  const response = await api.post(
    `/user`,
    userData
  );

  if (response.status === 400) {
    throw new Error(
      `${response.data}`
    );
  }
  if (response.status !== 200) {
    throw new Error(
      `An error occurred when registering new user: ${response.data}`
    );
  }

  return response.data;
}

/**
 * uploads photo for logged-in user
 * @param {FormData}
 * @returns
 */
export async function uploadPhoto(domForm) {
  const response = await api.post(
    '/photos/new',
    domForm
  );

  if (response.status === 400) {
    throw new Error(
      `${response.data}`
    );
  }
  if (response.status !== 200) {
    throw new Error(
      `An error occurred when registering new user: ${response.data}`
    );
  }

  return response.data;
}

/**
 * @param {Object} params
 * @param {string} params.login_name
 */
export async function loginRequest({ login_name, password}) {
  const response = await api.post(
    `/admin/login`,
    { login_name: login_name, password: password },
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
 * send a logout request. Fails if the session token does not have an valid user logged in
 * @returns a success message, or throws the error message.
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
