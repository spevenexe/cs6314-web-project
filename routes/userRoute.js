import { Router } from "express";
import { isAuthenticated } from "../controllers/middleware.js";
import { createUser, getUser, getUserList, currentUser } from "../controllers/userController.js";

const userRouter = Router();

// Returns all the User objects.
userRouter.get('/list', isAuthenticated, getUserList);

// Returns the information for User (id).
userRouter.get('/:id', isAuthenticated, getUser);

// Returns the currently logged in user
userRouter.post('/auth', isAuthenticated, currentUser);

// URL creates a new user
userRouter.post('/', createUser);

export default userRouter;
