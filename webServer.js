/**
 * Project 2 Express server connected to MongoDB 'project2'.
 * Start with: node webServer.js
 * Client uses axios to call these endpoints.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from "mongoose";
// eslint-disable-next-line import/no-extraneous-dependencies
import bluebird from "bluebird";
import express, { json } from "express";
import session from "express-session";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ToDO - Your submission should work without this line. Comment out or delete this line for tests and before submission!
// import models from "./modelData/photoApp.js";

// Load the Mongoose schema for User, Photo, and SchemaInfo
// ToDO - Your submission will use code below, so make sure to uncomment this line for tests and before submission!
import User from "./schema/user.js";
import Photo from "./schema/photo.js";
import SchemaInfo from "./schema/schemaInfo.js";

const portno = 3001; // Port number to use
const app = express();

app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000' || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// project 3: add session management
app.use(session({
  secret: 'none',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // because we are on localhost
    sameSite: "lax",
  }
}));
app.use(json());

mongoose.Promise = bluebird;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project3", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * /test/info - Returns the SchemaInfo object of the database in JSON format.
 *              This is good for testing connectivity with MongoDB.
 */
app.get('/test/info', (request, response) => {
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
});

/**
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get('/test/counts', (request, response) => {
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
});

async function isAuthenticated(request, response, next) {
  const user = request.session.user;
  
  if (user == null) {
    response.status(401).send("Only logged users are authorized to access this.");
    return;
  }
  
  const query = await User.findById(user._id)
    .select("_id")
    .lean()
    .exec();

  if (query.length === 0) {
    response.status(401).send("Only logged users are authorized to access this.");
  } else {
    next();
  }
}

/**
 * URL /user/list - Returns all the User objects.
 */
app.get('/user/list', isAuthenticated, (request, response) => {
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
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get('/user/:id', isAuthenticated, (request, response) => {
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
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get('/photosOfUser/:id', isAuthenticated, async (request, response) => {
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
      comment: item.comment,
      date_time: item.date_time,
      user: item.user_id,
    })),
  }));

  response.status(200).send(result);
});

app.get('/commentsOfUser/:id', isAuthenticated, async (request, response) => {
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
});

/**
 * Attempt to the log the user in via the post request
 */
app.post('/admin/login', async (request, response, next) => {
  const { login_name } = request.body;

  if (!login_name) {
    response.status(400).send("No username provided.");
    return;
  }

  try {
    const query = User.find({ login_name: login_name })
      .select("_id")
      .lean()
      .exec();

    const user = await query;
    // if no user is matched, throw error
    if (user.length === 0) throw new Error(`Account ${login_name} does not exist.`);

    const uid = user[0]._id.toString();

    // set the session
    // request.session.user = { _id: uid };
    // console.log(request.session.user);

    request.session.regenerate(err1 => {
      if (err1) return next(err1);

      request.session.user = { _id: uid };

      return request.session.save(err2 => {
        if (err2) return next(err2);

        return response.status(200).send({ _id: uid });
      });
    });


    // response.status(200).send({ _id: uid });
  } catch (error) {
    response.status(400).send(error.message);
  }
});

app.post('/admin/logout', async (request, response) => {
  if (!request.session.user) {
    response.status(400).send('No user currently logged in.');
    return;
  }

  request.session.destroy((err) => {
    if (err) {
      return response.status(500).send(`Error logging out: ${err}`)
    }

    // response.redirect('/login-register');
    response.status(200).send('Successfullly logged out');
  });
});

const server = app.listen(portno, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
    port +
    " exporting the directory " +
    __dirname
  );
});
