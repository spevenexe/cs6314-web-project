import User from "../schema/user.js";

/**
 * Returns all the User objects.
 */
export function getUserList (request, response) {
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
export function getUser (request, response) {
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