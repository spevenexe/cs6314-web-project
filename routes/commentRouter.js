import { Router } from "express";

import { getComments, postComment, getPhotosByMention, deleteComment } from "../controllers/commentController.js";
import { isAuthenticated } from "../controllers/middleware.js";

const commentRouter = Router();

// gets all comments made by a user
commentRouter.get('/commentsOfUser/:id', isAuthenticated, getComments);

//adds comment to photo's comments
commentRouter.post('/commentsOfPhoto/:photo_id', isAuthenticated, postComment);

/**
 * get comments by mention
 */
commentRouter.get('/photosByMention/:id', isAuthenticated, getPhotosByMention);

// delete a comment, if the user is the poster of the comment
commentRouter.delete('/comments/:id',isAuthenticated,deleteComment);

export default commentRouter;