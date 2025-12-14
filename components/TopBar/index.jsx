import React from "react";
import {
  AppBar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMutation, useQuery } from "@tanstack/react-query";

import "./styles.css";
import { useNavigate, Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  useAdvancedFeature,
  usePageStore,
  useLogin,
} from "../../lib/store";
import { getUser } from "../../api/user.js";
import { logoutRequest } from "../../api/admin.js";
import socket from "../../api/socket";
import { PageType } from "../../lib/util.jsx";
import PhotoUpload from "./PhotoUpload";

// Shows the status of page: which user we are looking at, what page type, whether advanced mode is activated
function TopBar() {
  const navigate = useNavigate();

  const { userId: uid, pageType: pType, UpdatePageType } = usePageStore();
  const { advancedEnabled, setAdvancedFeatures } = useAdvancedFeature();

  // fetch the user name
  const {
    isPending,
    isError,
    data: userName,
    error,
  } = useQuery({
    queryKey: ["topbar", uid],
    queryFn: () => {
      return getUser(uid).then((userData) => {
        return `${userData.first_name} ${userData.last_name}`;
      });
    },
  });

  const loginToken = useLogin((state) => state.token);
  const logoutMutate = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      useLogin.getState().setToken("");
      navigate("/login-register");
      socket.disconnect();
    },
    onError: (err) => {
      console.error("Error logging out: ", err);
    },
  });
  const {
    isPending: isPending_loggedUser,
    isError: isError_loggedUser,
    data: loggedUser,
    error: error_loggedUser,
  } = useQuery({
    queryKey: ["topbar_loggedUser", loginToken],
    queryFn: () => {
      return getUser(loginToken);
    },
  });

  if (isError_loggedUser && loginToken) {
    console.error("Login Token:", loginToken);
    return (
      <>
        An error occurred while fetching the logged user:{" "}
        {error_loggedUser.message}
      </>
    );
  }

  const loggedUserDisplay = loginToken
    ? `Hi ${loggedUser.first_name}`
    : "Please login";

  const handleLog = () => {
    if (!loginToken) {
      navigate("/login-register");
      return;
    }

    usePageStore.getState().UpdateID("");
    logoutMutate.mutate();
  };

  const handleChange = (event) => {
    const checked = event.target.checked;

    // when "Advanced mode" is toggled, photos may need help finding which photo to navigate to, since the indicess are not linear. This helps give it a nudge.
    if (pType === "photo") {
      navigate(`/photos/${uid}`);
    }

    setAdvancedFeatures(checked);
  };

  if (isPending && uid) return <>Loading...</>;
  if (isError && uid) {
    console.error("UID:", uid);
    return <>An error occurred while fetching the user: {error.message}</>;
  }

  // top right context
  let context;
  if (!loginToken) context = "";
  else if (pType === PageType.FAVORITE) context = "";
  else if (pType === PageType.DETAIL) context = userName;
  else if (pType === PageType.PHOTO) context = `Photos of ${userName}`;
  else if (pType === PageType.COMMENT) context = `Comments of ${userName}`;

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="toolbar-container">
        <Typography variant="h5" color="inherit">
          {isPending_loggedUser && loginToken
            ? "Loading..."
            : loggedUserDisplay}
        </Typography>
        {loginToken ? <PhotoUpload /> : ""}
        <div className="topbar-checkbox-container">
          {loginToken && (
            <FormGroup>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={advancedEnabled}
                    onChange={handleChange}
                    sx={{
                      color: grey[400],
                      "&.Mui-checked": {
                        color: grey[200],
                      },
                    }}
                  />
                )}
                label="Advanced Features"
              />
            </FormGroup>
          )}
          <Button
            component={Link}
            className="fav-btn"
            to="/favorites"
            variant="contained"
            startIcon={<FavoriteIcon />}
            onClick={() => {UpdatePageType(PageType.FAVORITE);}}
            sx={{
              ml: 1,
              mr: 1,
            }}
          >
            Favorites
          </Button>
          <Typography variant="h5" color="inherit">
            {context}
          </Typography>
          <Button
            variant="contained"
            color={loginToken ? "error" : "primary"}
            sx={{ ml: 2 }}
            onClick={handleLog}
          >
            {loginToken ? "Logout" : "Login"}
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
