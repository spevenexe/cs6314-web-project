import api from "./api";

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
  const {
    login_name,
    password,
    first_name,
    last_name,
  } = userData;

  if (!login_name) throw new Error("Missing field: User Name ");
  if (!password) throw new Error("Missing field: Password ");
  if (!first_name) throw new Error("Missing field: First Name ");
  if (!last_name) throw new Error("Missing field: Last Name");

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
 * @param {Object} params
 * @param {string} params.login_name
 */
export async function loginRequest({ login_name, password }) {
  if (!login_name) throw new Error("No Login name supplied.");
  if (!password) throw new Error("No password supplied.");

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
