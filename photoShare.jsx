import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from "react-dom/client";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

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

const queryClient = new QueryClient();

function UserDetailRoute() {
    const { userId } = useParams();
    return <UserDetail userId={userId}/>;
}

function UserPhotosRoute() {
    const { userId, photoId } = useParams();
    return (
        <UserPhotos
            userId={userId}
            photoId={photoId}
        />
    );
}

function UserCommentsRoute() {
    const { userId } = useParams();
    return (
        <UserComments
            userId={userId}
        />
    );
}

function PhotoShare() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TopBar/>
                        </Grid>
                        <div className="main-topbar-buffer" />
                        <Grid item sm={3}>
                            <Paper className="main-grid-item">
                                <UserList/>
                            </Paper>
                        </Grid>
                        <Grid item sm={9}>
                            <Paper className="main-grid-item">
                                <Routes>
                                    <Route
                                        path="/users/:userId"
                                        element={<UserDetailRoute/>}
                                    />
                                    <Route
                                        path="/photos/:userId"
                                        element={(
                                            <UserPhotosRoute/>
                                        )}
                                    />
                                    <Route
                                        // for "Advanced Features" photos are indexed by their ids, rather than a incremental index
                                        path="/photos/:userId/:photoId"
                                        element={(
                                            <UserPhotosRoute/>
                                        )}
                                    />
                                    {/* Route for the new view of user comments*/}
                                    <Route
                                        path="/comments/:userId"
                                        element={(
                                            <UserCommentsRoute/>
                                        )}
                                    />
                                    <Route path="/users" element={<UserList />} />
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
