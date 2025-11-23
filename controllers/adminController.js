import User from "../schema/user.js";

/**
 *  Log the user in. Expects <code>login_name</code> to be a property in <code>request.body</code>
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
export async function LogIn(request, response, next) {
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

    
    request.session.regenerate(err1 => {
      if (err1) return next(err1);
      
      // set the session
      request.session.user = { _id: uid };

      return request.session.save(err2 => {
        if (err2) return next(err2);

        return response.status(200).send({ _id: uid });
      });
    });


  } catch (error) {
    response.status(400).send(error.message);
  }
}

export async function LogOut(request, response) {
  if (!request.session.user) {
    response.status(400).send('No user currently logged in.');
    return;
  }

  request.session.destroy((err) => {
    if (err) {
      return response.status(500).send(`Error logging out: ${err}`);
    }

    return response.status(200).send('Successfullly logged out');
  });
}