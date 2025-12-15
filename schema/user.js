// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from "mongoose";
import { IO } from "../socket.js";

/**
 * Define the Mongoose Schema for a User.
 */
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  login_name: String,
  password: String,
  location: String,
  description: String,
  occupation: String,
  favoritedPhotos: [mongoose.Schema.Types.ObjectId],
});

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const user_id = this._id;

    const Photo = mongoose.model('Photo');
    const User = mongoose.model('User');
    const userPhotos = await Photo.find({ user_id }).exec();

    // delete all photos from user
    await Photo.deleteMany({ user_id: user_id }).exec();

    // delete all comments by user
    await Photo.updateMany(
      { "comments.user_id": user_id },
      {
        $pull: {
          comments: { user_id: user_id }
        }
      }
    )
      .exec();

    // remove all mentions of user
    await Photo.updateMany(
      { "comments.mentions": user_id },
      [
        {
          $set: {
            comments: {
              $map: {
                input: '$comments',
                as: 'c',
                in: {
                  $mergeObjects: [
                    '$$c',
                    {
                      regexResObject: {
                        $regexFindAll: {
                          input: '$$c.comment',
                          regex: `@\\[[^\\]]+\\]\\(${user_id.toString()}\\)`
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $set: {
            comments: {
              $map: {
                input: '$comments',
                as: 'c',
                in: {
                  $mergeObjects: [
                    '$$c',
                    {
                      mentions: {
                        $filter: {
                          input: '$$c.mentions',
                          as: 'm',
                          cond: {
                            $ne: [
                              '$$m',
                              user_id
                            ]
                          }
                        }
                      },
                      comment: {
                        $reduce: {
                          input: '$$c.regexResObject',
                          initialValue: '$$c.comment',
                          in: {
                            $replaceAll: {
                              input: '$$value',
                              find: '$$this.match',
                              replacement: '@Deleted User'
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            'comments.regexResObject': 0
          }
        }
      ]
    )
      .exec();

    await User.updateMany(
      { favoritedPhotos: { $in: userPhotos.map(photo => photo._id) } },
      {
        $pull: {
          favoritedPhotos: { $in: userPhotos.map(photo => photo._id) }
        }
      }
    ).exec();

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.post('deleteOne', { document: true, query: false }, async function () {
  try {
    const io = IO();
    io.emit("user delete");

  } catch (error) {
    console.error(error);
  }
});

/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const User = mongoose.model("User", userSchema);

/**
 * Make this available to our application.
 */
export default User;
