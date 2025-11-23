import Photo from "../schema/photo.js";
import User from "../schema/user.js";

/**
 * Get all comments made by a user
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
export async function getComments(request, response) {
  const id = request.params.id;
  const query = Photo.find()
    .select("_id user_id comments file_name date_time")
    .populate("comments.user_id", "_id first_name last_name", User)
    .lean();

  const { ok, photos } = await query.exec()
    .then(res => ({ ok: true, photos: res }))
    .catch(err => {
      response.status(404).send(`Failed to load photos from database`);
      console.error(err);
      return { ok: false };
    });

  // an error was caught and sent to the front-end. Stop.
  if (!ok) return;

  const result = photos
    .flatMap(photo => photo.comments.map(item => {
      const { comments, ...photosWithoutComment } = photo;

      return {
        _id: item._id,
        comment: item.comment,
        date_time: item.date_time,
        user: item.user_id,
        photo: photosWithoutComment,
      };
    }),
    )
    .filter(item => item.user._id.toString() === id);

  if (result.length === 0) {
    response.status(400).send(`Id ${id} has invalid format or has made no comments. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.`);
    return;
  }
  response.status(200).send(result);
}

export async function postComment(request, response) {
  const { comment } = request.body;
  if (!comment) {
    return response.status(400).send("No comment provided.");
  }
  
  const photo_id = request.params.photo_id;
  const photo = await Photo.findById(photo_id);
  if (!photo) {
    return response.status(404).send(`No photo with id ${photo_id} found`);
  }

  const newComment = {
    comment: comment,
    date_time: new Date(),
    user_id: request.session.user,
  };

  photo.comments.push(newComment);
  await photo.save();

  return response.status(200).send(newComment);
}