import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { useThemeMode } from "../contexts/ThemeContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();

  const { mode, toggleMode } = useThemeMode();
  const { favorites } = useFavorites();
  const { user, isLoggedIn, logout } = useAuth();

  const accountLabel = user?.name || user?.username || user?.email || "Account";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Movie Explorer
        </Typography>

        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>

        <Button color="inherit" component={RouterLink} to="/favorites">
          <Badge badgeContent={favorites.length} color="error">
            Favorites
          </Badge>
        </Button>

        {!isLoggedIn ? (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {accountLabel}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}

        <IconButton sx={{ ml: 1 }} onClick={toggleMode} color="inherit">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}