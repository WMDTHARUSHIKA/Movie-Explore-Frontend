import React from "react";
import {
  Card, CardMedia, CardContent, Typography, CardActions,
  Button, Rating, Box, IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { useFavorites } from "../contexts/FavoritesContext";

const MovieCard = ({ movie }) => {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  if (!movie || !movie.id || !movie.title) return null;

  const isFav = isFavorite(movie.id);

  const handleFavoriteToggle = () => {
    if (isFav) removeFavorite(movie.id);
    else addFavorite(movie);
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="300"
        image={
          movie.poster_path
            ? `${posterBaseUrl}${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={movie.title}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {movie.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Release:{" "}
          {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Rating
            name="read-only"
            value={(movie.vote_average || 0) / 2}
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"})
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button size="small" component={RouterLink} to={`/movie/${movie.id}`}>
          View Details
        </Button>

        <IconButton
          onClick={handleFavoriteToggle}
          aria-label="add to favorites"
          color={isFav ? "error" : "default"}
        >
          {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default MovieCard;