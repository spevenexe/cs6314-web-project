import mongoose from "mongoose";
import Photo from "../schema/photo.js";
import User from "../schema/user.js";
import { IO } from "../socket.js";

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
      response.status(400).send(`Failed to load photos from database. Is ${id} a valid format? Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.`);
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

  response.status(200).send(result);
}

export async function postComment(request, response) {
  const { comment, mentions } = request.body;
  if (!comment) {
    return response.status(400).send("No comment provided.");
  }
  const photo_id = request.params.photo_id ? request.params.photo_id : "";

  try {
    const photo = await Photo.findById(photo_id)
      .select("_id user_id file_name comments");
    // .populate("user_id", "_id first_name last_name", User)
    // .populate("comments.user_id", "_id first_name last_name", User);
    if (!photo) {
      return response.status(404).send(`No photo with id ${photo_id} found`);
    }

    const newComment = {
      comment: comment,
      mentions: mentions ?? [],
      date_time: new Date(),
      user_id: request.session.user,
    };

    console.log("here 1");
    
    // await photo.updateOne({}, {comments: {$push: {}}});
    photo.comments.push(newComment);
    await photo.save();
    
    const populatedPhoto = await Photo.findById(photo_id)
    .select("_id user_id file_name comments")
    .populate("user_id", "_id first_name last_name", User)
    .populate("comments.user_id", "_id first_name last_name", User);
    
    console.log("here 2");

    const newMention = {
      comment: comment,
      comment_id: populatedPhoto.comments[populatedPhoto.comments.length - 1]._id,
      comment_post_time: populatedPhoto.comments[populatedPhoto.comments.length - 1].date_time,
      photo: {
        _id: populatedPhoto._id,
        file_name: populatedPhoto.file_name,
        uploader: populatedPhoto.user_id,
      },
      user: populatedPhoto.comments[populatedPhoto.comments.length - 1].user_id
    };

    const io = IO();
    newComment.mentions.forEach(userId => {
      io.to(userId).emit("newMention", newMention);
    });

    return response.status(200).send(newComment);
  } catch (error) {
    return response.status(400).send(error.message);
  }
}

export async function getPhotosByMention(request, response) {
  const id = request.params.id;

  if (!id) {
    response.status(400).send('No user ID supplied.');
    return;
  }

  const query = Photo.find()
    .select("_id user_id comments file_name date_time")
    .populate("user_id", "_id first_name last_name", User)
    .lean();

  const { ok, photos } = await query.exec()
    .then(res => ({ ok: true, photos: res }))
    .catch(err => {
      response.status(400).send(`Failed to load photos from database. Is ${id} a valid format? Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.`);
      console.error(err);
      return { ok: false };
    });

  // an error was caught and sent to the front-end. Stop.
  if (!ok) return;

  const result = photos
    .filter(photo => photo.comments.some(comment => comment.mentions?.map(item => item.toString()).includes(id)));

  response.status(200).send(result);
}

export async function getMentions(request, response) {
  const user_id = request.params.id;

  if (!user_id) return response.status(400).send('No user ID supplied.');

  try {
    const query = await Photo.aggregate([
      {
        $unwind: {
          path: '$comments'
        }
      },
      // join commenter 
      {
        $lookup: {
          from: 'users',
          localField: 'comments.user_id',
          foreignField: '_id',
          as: 'comment_user'
        }
      }, {
        $unwind: {
          path: '$comment_user',
          preserveNullAndEmptyArrays: true
        }
      },
      // join photo uploader
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'photo_user'
        }
      }, {
        $unwind: {
          path: '$photo_user',
          preserveNullAndEmptyArrays: true
        }
      }, {
        $match: {
          'comments.mentions': new mongoose.Types.ObjectId(user_id)
        }
      }, {
        $project: {
          _id: '$comments._id',
          comment: '$comments.comment',
          date_time: '$comments.date_time',
          user: {
            _id: '$comment_user._id',
            first_name: '$comment_user.first_name',
            last_name: '$comment_user.last_name'
          },
          photo: {
            _id: '$_id',
            file_name: '$file_name',
            uploader: {
              _id: '$photo_user._id',
              first_name: '$photo_user.first_name',
              last_name: '$photo_user.last_name'
            }
          }
        }
      },
      { $sort: { date_time: -1 } }
    ]).exec();
    return response.status(200).send(query);
  } catch (error) {
    return response.status(400).send(error.message);
  }
}

export async function deleteComment(request, response) {
  const comment_id = request.params.id;
  const uid = request.session.user._id;

  try {
    const photos = await Photo.find()
      .select('_id comments')
      .lean()
      .exec();

    const commentPhotoMatches = photos
      .filter(photo => photo.comments.map(comment => comment._id.toString()).includes(comment_id));

    if (commentPhotoMatches.length === 0) {
      return response.status(404).send('comment not found.');
    }

    const commentPhoto = commentPhotoMatches[0];
    // validate the session user is the comment poster
    const newComments = commentPhoto.comments.filter(c => c._id.toString() !== comment_id || c.user_id.toString() !== uid);

    if (newComments.length === commentPhoto.comments.length) {
      return response.status(401).send("Only comment uploaders may delete their own comments");
    }

    // delete the comment
    const updateResponse = await Photo
      .updateOne({ _id: commentPhoto._id }, { comments: newComments })
      .exec();

    const oldComment = commentPhoto.comments.filter(c => c._id.toString() === comment_id)[0];
    const io = IO();
    oldComment.mentions.forEach(userId => {
      io.to(userId.toString()).emit("newMention", {});
    });

    if (!updateResponse.acknowledged) {
      throw new Error('Database failed to acknowledge delete request.');
    }
  } catch (error) {
    return response.status(400).send(error.message);
  }

  return response.status(200).send({ user_id: uid });
}