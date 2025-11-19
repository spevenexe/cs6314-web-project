import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import { Divider, Typography } from "@mui/material";

import "./styles.css";
import ButtonSwap from "../common/ButtonSwap";
import { getUser, setUserContext } from "../../api/api";
import { useQuery } from "@tanstack/react-query";

function UserDetail({ userId, setContext }) {
  // fetch the user details
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userContext", userId],
    queryFn: () =>
      getUser(userId).then((userData) => {
        const name = `${userData.first_name} ${userData.last_name}`;
        const _pageType = "detail";
        const context = {
          userId: userData._id,
          name: name,
          pageType: _pageType,
        };
        setContext(context);
        return userData;
      }),
  });

  if (isPending) return <>Loading...</>;
  if (isError)
    return <>An error occurred while fetching the database: {error.message}</>;

  return (
    <>
      <ButtonSwap userId={userId} pageType={"detail"} />
      <div>
        <Typography variant="h2">
          {data?.first_name} {data?.last_name}
        </Typography>
        <Typography variant="subtitle1">
          <b>Location:</b> {data?.location}. <b>Occupation:</b>{" "}
          {data?.occupation}
        </Typography>
        <Divider />
        <Typography sx={{ my: 5 }} variant="body1">
          {data?.description}
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
