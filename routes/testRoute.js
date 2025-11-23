import { Router } from "express";
import { getCollectionCounts, getTestInfo } from "../controllers/testController.js";

const testRouter = Router();

/**
 * /test/info - Returns the SchemaInfo object of the database in JSON format.
 *              This is good for testing connectivity with MongoDB.
 */
testRouter.get('/info', getTestInfo);

/**
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
testRouter.get('/counts', getCollectionCounts);

export default testRouter;