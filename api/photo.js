import api from "./api";

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
 * 
 */
export async function getPhotosByMention({ user_id }) {
  const response = await api.get(
    `/photosByMention/${user_id}`,
  );

  if (response.status === 400) {
    throw new Error(
      `${response.data}`
    );
  }

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while trying to get mentions: ${response.data}`
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

export async function deletePhoto(photo_id) {
  if (!photo_id) throw new Error("No photo supplied");

  const response = await api.delete(`/photos/${photo_id}`);

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while trying to delete the photo: ${response.data}`
    );
  }

  return response.data;
}