import React, { useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import { Divider, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { PageType } from "../../api/lib";
import { usePageStore } from "../../api/store";
import "./styles.css";
import ButtonSwap from "../common/ButtonSwap";
import { getUser } from "../../api/api";

function UserDetail({ userId }) {
  // fetch the user details
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userDetail", userId],
    queryFn: () => getUser(userId),
  });

  // update user detail context
  const UpdatePageStore = usePageStore((state) => state.UpdatePageStore);
  useEffect(() => {
    UpdatePageStore(userId, PageType.DETAIL);
  }, [userId]);

  if (isPending) return <>Loading...</>;
  if (isError) return <>An error occurred while fetching the database: {error.message}</>;

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
};

export default UserDetail;
