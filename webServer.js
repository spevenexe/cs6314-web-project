/**
 * Project 2 Express server connected to MongoDB 'project2'.
 * Start with: node webServer.js
 * Client uses axios to call these endpoints.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from "mongoose";
// eslint-disable-next-line import/no-extraneous-dependencies
import bluebird from "bluebird";
import express, { json } from "express";
import session from "express-session";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// routers
import testRouter from "./routes/testRoute.js";
import userRouter from "./routes/userRoute.js";
import photoRouter from "./routes/photoRoute.js";
import commentRouter from "./routes/commentRouter.js";
import adminRouter from "./routes/adminRoute.js";

const portno = 3001; // Port number to use
const app = express();

app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000' || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// project 3: add session management
app.use(session({
  secret: 'none',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // because we are on localhost
    sameSite: "lax",
  }
}));
app.use(json());

mongoose.Promise = bluebird;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project3", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.use("/test", testRouter);
app.use("/user", userRouter);
app.use("/", photoRouter);
app.use("/",commentRouter);
app.use("/admin",adminRouter);

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

app.use("/test", testRouter);
app.use("/user", userRouter);
app.use("/", photoRouter);
app.use("/",commentRouter);
app.use("/admin",adminRouter);

const server = app.listen(portno, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
    port +
    " exporting the directory " +
    __dirname
  );
});
