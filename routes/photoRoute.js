import { Router } from "express";

import { isAuthenticated} from "../controllers/middleware.js";
import { GetPhoto as getPhoto, uploadPhoto } from "../controllers/photoController.js";

const photoRouter = Router();

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
photoRouter.get('/photosOfUser/:id', isAuthenticated, getPhoto);

/**
 * Upload a new photo. Expects the request to have a file parameter
 */
photoRouter.post('/photos/new', uploadPhoto);

export default photoRouter;