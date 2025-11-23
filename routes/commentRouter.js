import { Router } from "express";

import { isAuthenticated } from "../controllers/middleware.js";
import { getComments, postComment } from "../controllers/commentConroller.js";

const commentRouter = Router();

// gets all comments made by a user
commentRouter.get('/commentsOfUser/:id', isAuthenticated, getComments);

//adds comment to photo's comments
commentRouter.post('/commentsOfPhoto/:photo_id', isAuthenticated, postComment);

export default commentRouter;