import api from "./api";

/**
 * Fetch all comments made by a particular user
 * @param {string} userId 
 * @returns 
*/
export async function getComments(userId) {
  if (!userId) throw new Error("No user Id supplied.");

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
export async function postComment({ photo_id, comment, mentions }) {
  if (!photo_id) throw new Error("No Photo supplied.");
  if (!comment) throw new Error("No Comment supplied.");
  if (mentions == null) console.warn("Mentions is null.");

  const response = await api.post(
    `/commentsOfPhoto/${photo_id}`,
    { comment: comment, mentions: mentions },
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

export async function getMentions({userId}) {
  if (!userId) throw new Error('no comment supplied');

  const response = await api.get(`/mentions/${userId}`);

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while trying to get mentions: ${response.data}`
    );
  }

  return response.data;
}

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