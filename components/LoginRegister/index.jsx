import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';

import { loginRequest, registerUser } from "../../api/admin";
import { useLogin } from "../../lib/store";

import socket from "../../api/socket";

export default function LoginRegister() {
  const [mode, setMode] = useState("login"); // "login" | "register"

  const [login_name, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password_match, setPasswordMatch] = useState(true);

  // to show 'ready to login' message after successful registration
  const [registerSuccess, setRegisterSuccess] = useState(false); 

  const navigate = useNavigate();
  const setToken = useLogin((state) => state.setToken);
  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: ({_id}) => {
      setToken(_id);

      // connect the socket and join the room
      socket.connect();
      socket.emit('joinUserRoom', _id);

      navigate(`/users/${_id}`);
      setRegisterSuccess(false);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setMode("login");
      setLoginName("");
      setPassword("");
      setPasswordConfirm("");
      setFirstName("");
      setLastName("");
      setLocation("");
      setDescription("");
      setOccupation("");
      setRegisterSuccess(true);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate({login_name: login_name, password: password});
    setRegisterSuccess(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterSuccess(false);
    if (password !== password_confirm) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
      registerMutation.mutate({
        login_name: login_name,
        password: password,
        first_name: first_name,
        last_name: last_name,
        location: location,
        description: description,
        occupation: occupation
      });
    }
  };

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

        {loginMutation.error && mode === "login" && (
          <Typography color="error" variant="body2">
            {loginMutation.error.message}
          </Typography>
        )}

        {registerSuccess && mode === "login" && (
          <Typography color="green" variant="body2">
            {"Registration Successful! You can now log in"}
          </Typography>
        )}

        {registerMutation.error && mode === "register" && (
          <Typography color="error" variant="body2">
            {registerMutation.error.response.data}
          </Typography>
        )}

        {mode === "login" ? (
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Login Name"
              value={login_name}
              onChange={(e) => setLoginName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loginMutation.isLoading}
              sx={{ mt: 2 }}
            >
              Login
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Need an account?{" "}
                <Button
                  variant="text"
                  onClick={() => {setMode("register"); setRegisterSuccess(false);}}
                >
                  Register
                </Button>
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Login Name"
              value={login_name}
              onChange={(e) => setLoginName(e.target.value)}
              margin="normal"
            />
            {!password_match && (
              <Typography color="error" variant="body2">
                {"Passwords must match"}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={password_confirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="First Name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={registerMutation.isPending}
              sx={{ mt: 2 }}
            >
              Register Me
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Already have an account?{" "}
                <Button
                  variant="text"
                  onClick={() => {setMode("login"); setRegisterSuccess(false);}}
                >
                  Login
                </Button>
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
