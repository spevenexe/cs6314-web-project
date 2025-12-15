import React, { useState } from "react";
import { Button, Divider, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import DeleteButtonState from "../../lib/deleteButtonState";
import { deleteUser } from "../../api/user.js";
import { logoutRequest } from "../../api/admin.js";
import { useLogin } from "../../lib/store.js";
import socket from "../../api/socket.js";

function DeleteUserButton() {
  const [buttonState, setButtonState] = useState(DeleteButtonState.DELETE);

  const navigate = useNavigate();
  const { setToken} = useLogin();
  const queryClient = useQueryClient();
  const { isError, isPending, mutate, error } = useMutation({
    mutationFn: async () => {
      try {
        await deleteUser();
        return logoutRequest();
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    },
    onSuccess: () => {
      // we need to refetch data for this user
      queryClient.invalidateQueries({ queryKey: ["userList"] });

      // logout on the frontend
      setToken("");
      navigate("/login-register");
      socket.disconnect();
    },
  });

  const confirmDelete = (event) => {
    event.preventDefault();
    if (buttonState === DeleteButtonState.DELETE) {
      setButtonState(DeleteButtonState.CONFIRM);
    } else {
      setButtonState(DeleteButtonState.DELETED);
      setTimeout(() => {
        mutate();
      }, 1000);
    }
  };

  const unconfirmDelete = (event) => {
    event.preventDefault();
    setButtonState(DeleteButtonState.DELETE);
  };

  let buttonText = "delete account";

  if (buttonState === DeleteButtonState.CONFIRM) buttonText = "Yes";
  if (isPending) buttonText = "Deleting Account...";
  if (buttonState === DeleteButtonState.DELETED) buttonText = "Account Deleted";
  if (isError) {
    console.error(error);
    buttonText = error.message;
  }

  return (
    <div className="userdetail-delete-confirm-container">
      {buttonState === DeleteButtonState.CONFIRM && (
        <Typography variant="h3" color={"error"}>
          Are you Sure?
        </Typography>
      )}
      <div className="userdetail-delete-button">
        <Button
          variant="contained"
          color="error"
          size="large"
          sx={{ mt: ".5rem" }}
          disabled={
            isPending || isError || buttonState === DeleteButtonState.DELETED
          }
          onClick={confirmDelete}
        >
          {buttonText}
        </Button>
        {buttonState === DeleteButtonState.CONFIRM && (
          <Button
            variant="contained"
            size="large"
            sx={{ mt: ".5rem" }}
            onClick={unconfirmDelete}
          >
            No
          </Button>
        )}
      </div>
    </div>
  );
}

export default function DangerZone() {
  return (
    <>
      <Typography variant="h3" sx={{ mt: "3rem" }}>
        DANGER ZONE
      </Typography>
      <Divider />
      <DeleteUserButton />
    </>
  );
}
