import React from "react";
import {
  AppBar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import { grey } from '@mui/material/colors';
import { useQuery } from "@tanstack/react-query";

import "./styles.css";
import { useNavigate } from "react-router-dom";
import { usePageStore } from "../../api/store";
import { getUser } from "../../api/api";
import { PageType } from "../../api/lib";

// Shows the status of page: which user we are looking at, what page type, whether advanced mode is activated
function TopBar({ userId, name, pageType, advancedFeatures, setAdvancedFeatures }) {
  const navigate = useNavigate();

  const {userId:uid,pageType:pType} = usePageStore();

  // fetch the user name
  const {
    isPending,
    isError,
    data: userName,
    error,
  } = useQuery({
    queryKey: ["topbar", uid],
    queryFn: () => getUser(uid).then((userData) => {
        return `${userData.first_name} ${userData.last_name}`;
      }),
  });

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
    return (
      <>An error occurred while fetching the user: {error.message}</>
    );
  }

  // top right context
  let context;
  if (pType === PageType.DETAIL) context = userName;
  else if (pType === PageType.PHOTO) context = `Photos of ${userName}`;
  else if (pType === PageType.COMMENT) context = `Comments of ${userName}`;

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="toolbar-container">
        <Typography variant="h5" color="inherit">
          Terrence Li
        </Typography>
        <div className="topbar-checkbox-container">
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={advancedFeatures}
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
          <Typography variant="h5" color="inherit">
            {context}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
