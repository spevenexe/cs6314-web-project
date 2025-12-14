import { Router } from "express";

import { deletePhoto, GetPhoto as getPhoto, uploadPhoto } from "../controllers/photoController.js";
import { isAuthenticated} from "../controllers/middleware.js";

const photoRouter = Router();

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
photoRouter.get('/photosOfUser/:id', isAuthenticated, getPhoto);

/**
 * Upload a new photo. Expects the request to have a file parameter
 */
photoRouter.post('/photos/new', isAuthenticated, uploadPhoto);

photoRouter.delete('/photos/:id',isAuthenticated, deletePhoto);

export default photoRouter;