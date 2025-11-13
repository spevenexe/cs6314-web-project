import React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";

// Simple hot-swapping button between details and photos
function ButtonSwap({ userId, pageType }) {
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            mb: ".5rem",
        }}>
            <Button
                component={Link}
                to={`/users/${userId}`}
                variant={(pageType === "photo") ? "outlined" : "contained"}>
                Details
            </Button>
            <Button
                component={Link}
                to={`/photos/${userId}`}
                sx={{ ml: ".5rem" }}
                variant={(pageType === "photo") ? "contained" : "outlined"}>
                Photos
            </Button>
        </Box>
    );
}

export default ButtonSwap;