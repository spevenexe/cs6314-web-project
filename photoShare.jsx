import React, { useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from "react-dom/client";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  Navigate,
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import LoginRegister from "./components/LoginRegister";
import { useLogin } from "./api/store";
import { getCurrentUser } from "./api/api";

const queryClient = new QueryClient();

function LoginRegisterRoute() {
  return <LoginRegister />;
}

function UserDetailRoute() {
  const { userId } = useParams();
  return <UserDetail userId={userId} />;
}

function UserPhotosRoute() {
  const { userId, photoId } = useParams();
  return <UserPhotos userId={userId} photoId={photoId} />;
}

function UserCommentsRoute() {
  const { userId } = useParams();
  return <UserComments userId={userId} />;
}

function PhotoShare() {
  const { token, setToken } = useLogin();

  // we have useEffect here, because useMutation has an issue hanging in the backend
  useEffect(() => {
    async function checkSession() {
      try {
        const data = await getCurrentUser();

        setToken(data._id);
      } catch (error) {
        console.error(error.response.data);
      }
    }
    checkSession();
  }, [token]);

  const loggedIn = token;
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                {loggedIn && <UserList />}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route
                    path="/login-register"
                    element={
                      loggedIn ? (
                        <Navigate replace to={`/users/${token}`} />
                      ) : (
                        <LoginRegisterRoute />
                      )
                    }
                  />
                  <Route
                    path="/users/:userId"
                    element={
                      loggedIn ? (
                        <UserDetailRoute />
                      ) : (
                        <Navigate replace to="/login-register" />
                      )
                    }
                  />
                  <Route
                    path={"/photos/:userId"}
                    element={
                      loggedIn ? (
                        <UserPhotosRoute />
                      ) : (
                        <Navigate replace to="/login-register" />
                      )
                    }
                  />
                  <Route
                    path={"/photos/:userId/:photoId"}
                    element={
                      loggedIn ? (
                        <UserPhotosRoute />
                      ) : (
                        <Navigate replace to="/login-register" />
                      )
                    }
                  />
                  <Route
                    path={"/comments/:userId"}
                    element={
                      loggedIn ? (
                        <UserCommentsRoute />
                      ) : (
                        <Navigate replace to="/login-register" />
                      )
                    }
                  />
                  <Route
                    path={"/users"}
                    element={
                      loggedIn ? (
                        <UserList />
                      ) : (
                        <Navigate replace to="/login-register" />
                      )
                    }
                  />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
root.render(<PhotoShare />);
