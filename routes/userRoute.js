import { Router } from "express";
import { createUser, getUser, getUserList, currentUser, addFavorite, removeFavorite, getFavorites, deleteUser } from "../controllers/userController.js";
import { isAuthenticated } from "../controllers/middleware.js";

const userRouter = Router();

// Returns all the User objects.
userRouter.get('/list', isAuthenticated, getUserList);

// Returns the information for User (id).
userRouter.get('/:id', isAuthenticated, getUser);

// Returns the currently logged in user
userRouter.post('/auth', isAuthenticated, currentUser);

// URL adds photo to favorites list of logged user
userRouter.post('/addFavorite/:photo_id', isAuthenticated, addFavorite);

// URL adds photo to favorites list of logged user
userRouter.post('/removeFavorite/:photo_id', isAuthenticated, removeFavorite);

// URL gets all favorite photos from logged user
userRouter.post('/favorites', isAuthenticated, getFavorites);

// URL creates a new user
userRouter.post('/', createUser);

// Delete an existing user
userRouter.delete('/delete', isAuthenticated, deleteUser);

export default userRouter;
