import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Link } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
// import { useAuthStore } from "../stores/authStore";
import { loginRequest } from "../../api/api";
import { useLogin } from "../../api/store";
import { useNavigate } from 'react-router-dom';

export default function LoginRegister() {
  //TODO: change to zustand if we still need this in the future
  const [mode, setMode] = useState("login"); // "login" | "register"

  const [loginName, setLoginName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate()
  const setToken = useLogin((state) => state.setToken);
  const { status, isError, isLoading, error, mutate: loginMutate} = useMutation({
    mutationFn: loginRequest,
    onSuccess: (user) => {
      setToken(user);
      navigate(`/users/${user}`);
    },
  });

//   const registerMutation = useMutation({
//     mutationFn: registerRequest,
//     onSuccess: () => {
//       alert("Registration successful! Please login.");
//       setMode("login");
//     },
//   });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutate({login_name: e.target[0].value});
    // mutate(loginName);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // registerMutation.mutate({
    //   login_name: loginName,
    //   first_name: firstName,
    //   last_name: lastName,
    // });
  };
    //const loginMutation = {isPending: false, isError: true, data: "", error: ""}
    const registerMutation = {isPending: false, isError: false, data: "", error: ""}

  return (
    <Box 
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 380 }}>
        <Typography variant="h5" gutterBottom align="center">
          {mode === "login" ? "Login" : "Register"}
        </Typography>

        {error && mode === "login" && (
          <Typography color="error" variant="body2">
            {error.message}
          </Typography>
        )}

        {registerMutation.error && mode === "register" && (
          <Typography color="error" variant="body2">
            {registerMutation.error.message}
          </Typography>
        )}

        {mode === "login" ? (
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Login Name"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              Login
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Need an account?{" "}
                <Link
                  component="button"
                  onClick={() => setMode("register")}
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Login Name"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={registerMutation.isPending}
              sx={{ mt: 2 }}
            >
              Register
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Already have an account?{" "}
                <Link
                  component="button"
                  onClick={() => setMode("login")}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
