import React, { useState } from "react";
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

function UserDetailRoute({ setContext }) {
    const { userId } = useParams();
    return <UserDetail userId={userId} setContext={setContext} />;
}

function UserPhotosRoute({
    setContext,
    advancedFeatures,
    setAdvancedFeatures,
}) {
    const { userId, photoId } = useParams();
    return (
        <UserPhotos
            userId={userId}
            photoId={photoId}
            setContext={setContext}
            advancedFeatures={advancedFeatures}
            setAdvancedFeatures={setAdvancedFeatures}
        />
    );
}

function UserCommentsRoute({
    setContext,
    advancedFeatures,
    setAdvancedFeatures,
}) {
    const { userId } = useParams();
    return (
        <UserComments
            userId={userId}
            setContext={setContext}
            advancedFeatures={advancedFeatures}
            setAdvancedFeatures={setAdvancedFeatures}
        />
    );
}

function PhotoShare() {
    // store the context for the TopBar in the parent object. Then, we pass the setter function to subcomponents, while passing context to TopBar
    const [context, setContext] = useState({});
    const [advancedFeatures, setAdvancedFeatures] = useState(false); //determiner of which mode to use

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TopBar
                                userId={context.userId}
                                name={context.name}
                                pageType={context.pageType}
                                advancedFeatures={advancedFeatures}
                                setAdvancedFeatures={setAdvancedFeatures}
                            />
                        </Grid>
                        <div className="main-topbar-buffer" />
                        <Grid item sm={3}>
                            <Paper className="main-grid-item">
                                <UserList advancedFeatures={advancedFeatures} />
                            </Paper>
                        </Grid>
                        <Grid item sm={9}>
                            <Paper className="main-grid-item">
                                <Routes>
                                    <Route
                                        path="/users/:userId"
                                        element={<UserDetailRoute setContext={setContext} />}
                                    />
                                    <Route
                                        path="/photos/:userId"
                                        element={(
                                            <UserPhotosRoute
                                                setContext={setContext}
                                                advancedFeatures={advancedFeatures}
                                                setAdvancedFeatures={setAdvancedFeatures}
                                            />
                                        )}
                                    />
                                    <Route
                                        // for "Advanced Features" photos are indexed by their ids, rather than a incremental index
                                        path="/photos/:userId/:photoId"
                                        element={(
                                            <UserPhotosRoute
                                                setContext={setContext}
                                                advancedFeatures={advancedFeatures}
                                                setAdvancedFeatures={setAdvancedFeatures}
                                            />
                                        )}
                                    />
                                    {/* Route for the new view of user comments*/}
                                    <Route
                                        path="/comments/:userId"
                                        element={(
                                            <UserCommentsRoute
                                                setContext={setContext}
                                                advancedFeatures={advancedFeatures}
                                                setAdvancedFeatures={setAdvancedFeatures}
                                            />
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
