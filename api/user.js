import api from "./api";

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
