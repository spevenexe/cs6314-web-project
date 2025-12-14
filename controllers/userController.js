import mongoose from "mongoose";
import User from "../schema/user.js";
import Photo from "../schema/photo.js";

/**
 * Returns all the User objects.
 */
export function getUserList(request, response) {
  User.find({})
    // select only what is needed
    .select("_id first_name last_name")
    .lean()
    .exec()
    .then(res => ({ ok: true, doc: res }))
    .catch(err => {
      response.status(400).send("An error occurred while fetching the user list.");
      console.error(err);
      return { ok: false };
    })
    .then(({ ok, doc }) => {
      // if an error occurred, don't re-set the header 
      if (!ok) return;
      response.status(200).send(doc);
    });
}

/**
 * Returns the information for User (id). Expects the id to be in the request url.
 */
export function getUser(request, response) {
  const id = request.params.id;

  User.findById(id)
    .select("_id first_name last_name location description occupation")
    .lean()
    .exec()
    .then(res => ({ ok: true, doc: res }))
    .catch(err => {
      // If something other than the id of a User is provided, the response should be a HTTP status of 400
      response.status(400).send(`Id ${id} has invalid format. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.`);
      console.error(err);
      return { ok: false };
    })
    .then(({ ok, doc }) => {
      // if an error occurred, don't re-set the header
      if (!ok) return;
      // 404 more fitting if the id is valid format but not in the database
      if (!doc) response.status(404).send(`User ${id} not found.`);
      else response.status(200).send(doc);
    });
}

/**
 * Returns the id of the logged in user
 */
export async function currentUser(request, response) {
  const uid = request.session.user;

  if (!uid) {
    return response.status(400).send(`No user logged in`);
  }

  return response.status(200).send(uid);
}


export async function createUser(request, response) {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = request.body;

  if (!login_name) {
    return response.status(400).send(`No login name provided`);
  }
  if (!password) {
    return response.status(400).send(`No password provided`);
  }
  if (!first_name) {
    return response.status(400).send(`No first name provided`);
  }
  if (!last_name) {
    return response.status(400).send(`No last name provided`);
  }

  const existingName = await User.findOne({ login_name: login_name });
  if (existingName) {
    return response.status(400).send(`Login name ${login_name} already exists`);
  }

  const newUser = new User({
    login_name,
    password,
    first_name,
    last_name,
    location: location || '',
    description: description || '',
    occupation: occupation || '',
  });

  const savedUser = await newUser.save();
  return response.status(200).send(savedUser);
}

export async function addFavorite(request, response) {
  const photo_id = request.params.photo_id;
  const user_id = request.session.user;

  if (!user_id) {
    return response.status(401).send(`Invalid User ID: ${user_id}`);
  }

  try {
    const user = await User.findById(user_id);

    if (!user) {
      return response.status(401).send(`User with ID ${user_id} not found`);
    }

    const photoObjId = new mongoose.Types.ObjectId(photo_id);
    if (!user.favoritedPhotos.includes(photoObjId)) {
      user.favoritedPhotos.push(photoObjId);
      await user.save();
    }

    return response.status(200).send(`Photo ${photo_id} added to Favorited Photos of User ${user_id}`);
  } catch (err) {
    console.error(err);
    return response.status(500).send(`Failed to add favorite`);
  }
}

export async function removeFavorite(request, response) {
  const photo_id = request.params.photo_id;
  const user_id = request.session.user;

  try {
    const user = await User.findById(user_id);

    if (!user) {
      return response.status(401).send(`User with ID ${user_id} not found`);
    }

    const photoObjId = new mongoose.Types.ObjectId(photo_id);
    if (!user.favoritedPhotos.includes(photoObjId)) {
      return response.status(401).send(`Photo ${photo_id} not found in Favorited Photos of User ${user_id}`);
    }
    user.favoritedPhotos = user.favoritedPhotos.filter(
      (id) => id.toString() !== photoObjId.toString()
    );

    await user.save();
    return response.status(200).send(`Photo ${photo_id} removed from Favorited Photos of User ${user_id}`);
  } catch (err) {
    console.error(err);
    return response.status(500).send(`Failed to remove favorite`);
  }
}

export async function getFavorites(request, response) {
  try {
    const user_id = request.session.user;

    const user = await User.findById(user_id)
      .select("favoritedPhotos")
      .lean()
      .exec();
    const favoritePhotoIds = user?.favoritedPhotos ?? [];
    if (favoritePhotoIds.length === 0) {
      return response.status(200).send([]);
    }
    const photos = await Photo.find({ _id: { $in: favoritePhotoIds } })
      .select("_id date_time user_id file_name") // only select the fields you need
      .lean()
      .exec();

    return response.status(200).send(photos);
  } catch (err) {
    console.error(err);
    return response.status(400).send("An error occurred while fetching the favorite list.");
  }
}


export async function deleteUser(request, response) {
  const user_id = request.session.user;

  try {
    // making queries part of one transaction requires replica set, which is a separable toggle. So we leave the queries like this.

    // check existence of user
    const user = await User.findById(user_id)
    .select("_id")
    .exec();

    if (!user) return response.status(404).send("User not found.");

    // delete all photos from user
    await Photo.deleteMany({user_id: user_id}).exec();

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
                input: "$comments",
                as: "c",
                in: {
                  $mergeObjects: [
                    "$$c",
                    {
                      mentions: {
                        $filter: {
                          input: "$$c.mentions",
                          as: "m",
                          cond: { $ne: ["$$m", user_id] }
                        }
                      },
                      comment: {
                        // $trim: {
                        //   input: {
                            $replaceAll: {
                              input: "$$c.comment",
                              find: {
                                $regex: `@\\[[^\\]]+\\]\\(${user_id}\\)`
                              },
                              replacement: "@Deleted User"
                            }
                        //   }
                        // }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]
    )
    .exec();

    // delete user
    await User.findByIdAndDelete(user_id).exec();
  } catch (error) {
    response.status(400).send(error.message);
  }

  return response.status(200).send("User deleted successfully.");
}