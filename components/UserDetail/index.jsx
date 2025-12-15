import React, { useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import {
  Divider,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { PageType } from "../../lib/util.jsx";
import "./styles.css";
import ButtonSwap from "../common/ButtonSwap";
import { getUser } from "../../api/user.js";
import DangerZone from "./DangerZone.jsx";
import MentionsSection from "./MentionsSection.jsx";
import { useLogin, usePageStore } from "../../lib/store.js";

function UserDetail({ userId }) {
  //advanced features
  const {token} = useLogin();

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
  if (isError) {
    return <Typography variant="subtitle1"> An error occurred while fetching the database: {error.message} </Typography>;
  }

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
        <MentionsSection/>
        {token === userId && <DangerZone/>}
      </div>
    </>
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserDetail;
