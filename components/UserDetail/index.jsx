import React, { useEffect, useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import { Divider, Typography } from "@mui/material";

import "./styles.css";
import ButtonSwap from "../common/ButtonSwap";
import { setUserContext } from "../../api/api";

function UserDetail({ userId, setContext }) {
  const [user, setUserData] = useState({});

  // set the context of the top bar and set the user details
  useEffect(() => {
    setUserContext(userId, setContext, "detail").then((userData) => {
      setUserData(userData);
    });
  }, [userId]);

  return (
    <>
      <ButtonSwap userId={userId} pageType={"detail"} />
      <div>
        <Typography variant="h2">
          {user?.first_name} {user?.last_name}
        </Typography>
        <Typography variant="subtitle1">
          <b>Location:</b> {user?.location}. <b>Occupation:</b> {user?.occupation}
        </Typography>
        <Divider />
        <Typography sx={{ my: 5 }} variant="body1">
          {user?.description}
        </Typography>
      </div>
    </>
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string.isRequired,
  setContext: PropTypes.func.isRequired,
};

export default UserDetail;
