import api from "./api";

export async function deleteComment(commentId){
  if (!commentId) throw new Error('no comment supplied');

  const response = await api.delete(`/comments/${commentId}`);

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while trying to delete the comment: ${response.data}`
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