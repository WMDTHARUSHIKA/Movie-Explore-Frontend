import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { fetchMovieDetails } from "../services/tmdbService";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Box,
  Chip,
  Rating,
  Button, // Added Button
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star"; // For rating display
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // For back button

const MovieDetailsPage = () => {
  const { id: movieId } = useParams(); // Get movie ID from URL, alias 'id' to 'movieId' for clarity
  const navigate = useNavigate(); // Hook for programmatic navigation

  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDetails = async () => {
      if (!movieId) return; // Should not happen if route is set up correctly

      setLoading(true);
      setError(null);
      try {
        const details = await fetchMovieDetails(movieId);
        setMovieDetails(details);
      } catch (err) {
        setError(err.message);
        console.error(err.originalError || err);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [movieId]); // Re-fetch if movieId changes (e.g., navigating from one movie detail to another directly)

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)} // Go back to previous page
          sx={{ mb: 2 }}
        >
          Go Back
        </Button>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!movieDetails) {
    return (
      // Should ideally be caught by error state, but as a fallback
      <Container sx={{ py: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Go Back
        </Button>
        <Alert severity="info">Movie details not found.</Alert>
      </Container>
    );
  }

  // Find official YouTube trailer
  const officialTrailer = movieDetails.videos?.results.find(
    (vid) => vid.site === "YouTube" && vid.type === "Trailer"
  );

  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"; // For posters
  const profileBaseUrl = "https://image.tmdb.org/t/p/w185"; // For cast profile pictures

  return (
    <Container sx={{ py: 3 }}>
      {" "}
      {/* py is padding top and bottom */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)} // Go back to previous page
        sx={{ mb: 3 }} // Margin bottom
      >
        Go Back
      </Button>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        {" "}
        <Grid container spacing={3}>
          {/* Poster Image */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "600px",
                objectFit: "contain",
                borderRadius: 1,
              }}
              src={
                movieDetails.poster_path
                  ? `${posterBaseUrl}${movieDetails.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movieDetails.title}
            />
          </Grid>

          {/* Movie Info */}
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom>
              {movieDetails.title} (
              {movieDetails.release_date
                ? new Date(movieDetails.release_date).getFullYear()
                : "N/A"}
              )
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {movieDetails.tagline}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating
                name="movie-rating"
                value={movieDetails.vote_average / 2}
                precision={0.1}
                readOnly
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {movieDetails.vote_average?.toFixed(1)}/10 (
                {movieDetails.vote_count} votes)
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              {movieDetails.genres?.map((genre) => (
                <Chip label={genre.name} key={genre.id} sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>

            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
              Overview
            </Typography>
            <Typography variant="body1" paragraph>
              {movieDetails.overview || "No overview available."}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Release Date:</strong> {movieDetails.release_date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Runtime:</strong>{" "}
              {movieDetails.runtime ? `${movieDetails.runtime} minutes` : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Status:</strong> {movieDetails.status}
            </Typography>
          </Grid>
        </Grid>
        {/* Cast Section */}
        {movieDetails.credits?.cast && movieDetails.credits.cast.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Top Billed Cast
            </Typography>
            <Grid container spacing={2}>
              {movieDetails.credits.cast.slice(0, 10).map(
                (
                  member // Show top 10 cast members
                ) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={2.4}
                    key={member.cast_id || member.id}
                  >
                    {" "}
                    {/* md={2.4} for 5 items per row on medium screens */}
                    <Paper
                      elevation={1}
                      sx={{ textAlign: "center", p: 1, height: "100%" }}
                    >
                      <Avatar
                        alt={member.name}
                        src={
                          member.profile_path
                            ? `<span class="math-inline">\{profileBaseUrl\}</span>{member.profile_path}`
                            : undefined
                        }
                        sx={{
                          width: 80,
                          height: 80,
                          margin: "0 auto 8px auto",
                        }}
                      />
                      <Typography variant="subtitle2">{member.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.character}
                      </Typography>
                    </Paper>
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        )}
        {/* Trailer Section */}
        {officialTrailer && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Trailer
            </Typography>
            <Box
              sx={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                overflow: "hidden",
                maxWidth: "100%",
                background: "#000",
                "& iframe": {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                },
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${officialTrailer.key}`}
                title={`${movieDetails.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          </Box>
        )}
        {!officialTrailer && movieDetails.videos?.results?.length > 0 && (
          <Typography sx={{ mt: 2 }}>
            Official trailer not found, but other videos may be available.
          </Typography>
        )}
        {!officialTrailer &&
          (!movieDetails.videos ||
            movieDetails.videos?.results?.length === 0) && (
            <Typography sx={{ mt: 2 }}>
              No videos available for this movie.
            </Typography>
          )}
      </Paper>
    </Container>
  );
};

export default MovieDetailsPage;
