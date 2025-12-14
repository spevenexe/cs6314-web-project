
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from "mongoose";

/**
 * Define the Mongoose Schema for a Comment.
 */
const commentSchema = new mongoose.Schema({
  // The text of the comment.
  comment: String,
  // The date and time when the comment was created.
  date_time: { type: Date, default: Date.now },
  // The ID of the user who created the comment.
  user_id: mongoose.Schema.Types.ObjectId,
  // The IDs of users mentioned in the comment.
  mentions: [mongoose.Schema.Types.ObjectId],
});

/**
 * Define the Mongoose Schema for a Photo.
 */
const photoSchema = new mongoose.Schema({
  // Name of the file containing the photo (in the project2/images directory).
  file_name: String,
  // The date and time when the photo was added to the database.
  date_time: { type: Date, default: Date.now },
  // The ID of the user who created the photo.
  user_id: mongoose.Schema.Types.ObjectId,
  // Array of comment objects representing the comments made on this photo.
  comments: [commentSchema],
});

photoSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    try {
      const photo_id = this._id;

      const User = mongoose.model('User');

      await User.updateMany(
        { favoritedPhotos: photo_id },
        {
          $pull: {
            favoritedPhotos: photo_id
          }
        }
      ).exec();

      next();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Create a Mongoose Model for a Photo using the photoSchema.
 */
const Photo = mongoose.model("Photo", photoSchema);

/**
 * Make this available to our application.
 */
export default Photo;
