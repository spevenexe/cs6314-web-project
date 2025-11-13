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

import "./styles.css";
import { useNavigate } from "react-router-dom";

// Shows the status of page: which user we are looking at, what page type, whether advanced mode is activated
function TopBar({ userId, name, pageType, advancedFeatures, setAdvancedFeatures }) {
  const navigate = useNavigate();

  const handleChange = (event) => {
    const checked = event.target.checked;

    // when "Advanced mode" is toggled, photos may need help finding which photo to navigate to, since the indicess are not linear. This helps give it a nudge.
    if (pageType === "photo") {
      navigate(`/photos/${userId}`);
    }

    setAdvancedFeatures(checked);
  };

  let context = name;

  if (pageType === "photo") context = `Photos of ${name}`;
  if (pageType === "comment") context = `Comments of ${name}`;

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
