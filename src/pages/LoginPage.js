import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

import api from "../services/apiClient";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Your backend endpoint:
      // POST http://localhost:5000/api/login
      const res = await api.post("/login", { email, password });

      // Handle different backend response shapes:
      const token =
        res.data?.token || res.data?.accessToken || res.data?.jwt || res.data?.data?.token;

      const user =
        res.data?.user || res.data?.profile || res.data?.data?.user || { email };

      if (!token) {
        throw new Error("Login response did not include a token.");
      }

      // Save to AuthContext (Navbar reads this)
      login({ token, user });

      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Login
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Box>
  );
}