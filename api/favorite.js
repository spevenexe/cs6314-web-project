import api from "./api";

/**
 * Adds photo to logged user's list of favorites
 * @param {string} photoId
 * @returns 
 */
export async function addFavorite(photoId) {
  const response = await api.post(
    `/user/addFavorite/${photoId}`
  );

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while adding favorite: ${response.data}`
    );
  }

  return response.data;
}

/**
 * Removes photo to logged user's list of favorites
 * @param {string} photoId
 * @returns 
 */
export async function removeFavorite(photoId) {
  const response = await api.post(
    `/user/removeFavorite/${photoId}`
  );

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while removing favorite: ${response.data}`
    );
  }

  return response.data;
}

/**
 * 
 * @returns The list of favorites of logged user
 */
export async function getFavorites() {
  const response = await api.post(
    `/user/favorites`
  );

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while fetching list of favorites: ${response.data}`
    );
  }

  return response.data;
}
