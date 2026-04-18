import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "./components/navBar";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";

import { CustomThemeProvider } from "./contexts/ThemeContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { AuthProvider } from "./contexts/AuthContext";

import "./App.css";

export default function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <Navbar />
            <Container sx={{ mt: 4, mb: 4 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </Container>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}