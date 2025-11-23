import multer from "multer";
import User from "../schema/user.js";

export const processFormBody = multer({ storage: multer.memoryStorage() }).single('uploadedphoto');


export async function isAuthenticated(request, response, next) {
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