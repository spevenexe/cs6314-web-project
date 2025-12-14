import Photo from "../schema/photo.js";
import User from "../schema/user.js";
import SchemaInfo from "../schema/schemaInfo.js";

/**
 * Returns the SchemaInfo object of the database in JSON format.
 *              This is good for testing connectivity with MongoDB.
 * @param {*} request 
 * @param {*} response 
 */
export function getTestInfo (request, response) {
  const query = SchemaInfo.find({});
  query
    .lean()
    .exec()
    .then(res => ({ ok: true, doc: res }))
    .catch(err => {
      console.error(err);
      response.status(400).send("Failed to Schema info.");
      return { ok: false };
    })
    .then(({ ok, doc }) => {
      if (!ok) return;
      response.status(200).send(doc[0]);
    });
}

/**
 * Returns an object with the counts of the different collections
 *                in JSON format.
 * @param {*} request 
 * @param {*} response 
 */
export function  getCollectionCounts (request, response) {
  const userQuery = User.count({}).exec();
  const photoQuery = Photo.count({}).exec();
  const schemaQuery = SchemaInfo.count({}).exec();

  // group the promises
  Promise.all([userQuery, photoQuery, schemaQuery])
    .then(res => ({ ok: true, data: res }))
    .catch(err => {
      console.error(err);
      response.status(400).send("Failed to fetch counts.");
      return { ok: false };
    })
    .then(({ ok, data }) => {
      // an error occurred, and the header was already sent
      if (!ok) return;

      const [userCount, photoCount, schemaCount] = data;

      response.status(200).send({
        user: userCount,
        photo: photoCount,
        schemaInfo: schemaCount
      });
    }
    );
}