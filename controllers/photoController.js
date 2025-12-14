import fs from "fs";
import mongoose from "mongoose";

import { processFormBody } from "./middleware.js";
import Photo from "../schema/photo.js";
import User from "../schema/user.js";


/**
 * Returns the Photos for User (id). Exports the request url to have an id parameter
 * @param {*} request 
 * @param {*} response 
 */
export async function GetPhoto(request, response) {
  const id = request.params.id;
  const query = Photo.find({ user_id: id })
    .select("_id user_id comments file_name date_time")
    .populate("comments.user_id", "_id first_name last_name", User)
    .lean();

  const { ok, photos } = await query.exec()
    .then(res => ({ ok: true, photos: res }))
    .catch(err => {
      // bad id parameter
      response.status(400).send(`Id ${id} has invalid format. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer.`);
      console.error(err);
      return { ok: false };
    });

  // an error was caught and sent to the front-end. Stop.
  if (!ok) return;

  const result = photos.map(photo => ({
    ...photo,
    comments: photo.comments.map(item => ({
      _id: item._id,
      comment: item.comment,
      date_time: item.date_time,
      user: item.user_id,
    })),
  }));

  response.status(200).send(result);
}

export async function uploadPhoto(request, response) {
  processFormBody(request, response, (err1) => {
    if (err1) {
      return response.status(500).send(`Error processing photo: ${err1}`);
    }
    if (!request.file) {
      return response.status(400).send(`No file provided`);
    }

    const timestamp = new Date().valueOf();
    const filename = 'U' + String(timestamp) + request.file.originalname;

    return fs.writeFile('./images/' + filename, request.file.buffer, (err2) => {
      if (err2) {
        return response.status(500).send(`Error writing photo: ${err2}`);
      }

      const newPhoto = new Photo({
        file_name: filename,
        date_time: new Date(),
        user_id: request.session.user,
        comments: [],
      });

      return newPhoto.save()
        .then((photo) => {
          return response.status(200).send(photo);
        })
        .catch((err3) => {
          response.status(500).send(`Error saving photo: ${err3}`);
        });
    });
  });
}

export async function deletePhoto(request, response) {
  const photo_id = request.params.id;
  const user_id = request.session.user._id;

  try {
    // validate
    const photo = await Photo.findById(photo_id)
      .select("user_id")
      .lean()
      .exec();

    if (photo.user_id.toString() !== user_id) {
      return response.status(401).send("Only owners of the photo may delete their own photo");
    }
  
    await Photo.findByIdAndDelete(new mongoose.Types.ObjectId(photo_id))
      .exec();
  } catch (error) {
    return response.status(400).send(error.message);
  }


  return response.status(200).send({user_id: user_id});
}