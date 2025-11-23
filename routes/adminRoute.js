import { Router } from "express";
import { LogIn, LogOut } from "../controllers/adminController.js";

const adminRouter = Router();
//  log the user in via the post request
adminRouter.post('/login', LogIn);
// Log the user out, if a session exists
adminRouter.post('/logout', LogOut);

export default adminRouter;