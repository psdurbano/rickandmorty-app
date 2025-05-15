import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Fade,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

function CharacterCard() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [episode, setEpisode] = useState("");

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const characterData = await fetchData(
          `https://rickandmortyapi.com/api/character/${id}`
        );
        if (characterData) {
          setCharacter(characterData);
          const locationName = await fetchData(characterData.location.url);
          if (locationName) {
            setLocation(locationName.name);
          }
          const episodeData = await fetchData(characterData.episode[0]);
          if (episodeData) {
            setEpisode(episodeData.name);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  let statusIcon;
  if (character?.status === "Alive") {
    statusIcon = (
      <CheckCircleOutlineIcon
        sx={{
          fontSize: "inherit",
          color: "#97ce4c",
          verticalAlign: "middle",
          marginRight: "4px",
          filter: "drop-shadow(0 2px 4px rgba(151, 206, 76, 0.3))",
        }}
      />
    );
  } else if (character?.status === "Dead") {
    statusIcon = (
      <RadioButtonUncheckedIcon
        sx={{
          fontSize: "inherit",
          color: "#e74c3c",
          verticalAlign: "middle",
          marginRight: "4px",
          filter: "drop-shadow(0 2px 4px rgba(231, 76, 60, 0.3))",
        }}
      />
    );
  } else {
    statusIcon = (
      <HelpOutlineIcon
        sx={{
          fontSize: "inherit",
          color: "#95a5a6",
          verticalAlign: "middle",
          marginRight: "4px",
          filter: "drop-shadow(0 2px 4px rgba(149, 165, 166, 0.3))",
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        overflow: "auto", // Controla el desbordamiento
        padding: { xs: "16px", sm: "24px", md: "32px" },
        display: "flex", // Asegura que el contenido se ajuste correctamente
        flexDirection: "column", // Organiza el contenido en columna
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <IconButton
          sx={{
            color: "#fff",
            marginBottom: "24px",
            "&:hover": {
              backgroundColor: "rgba(151, 206, 76, 0.1)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Link>

      {loading ? (
        <Fade in={loading}>
          <Card
            sx={{
              maxWidth: { xs: "100%", sm: "600px", md: "800px" },
              margin: "0 auto",
              background: "rgba(32, 35, 41, 0.95)",
              borderRadius: "16px",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
            }}
          >
            <Skeleton
              variant="rectangular"
              height={{ xs: "200px", sm: "300px", md: "400px" }}
            />
            <CardContent>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        </Fade>
      ) : (
        <Fade in={!loading}>
          <Card
            sx={{
              maxWidth: { xs: "100%", sm: "600px", md: "800px" },
              width: "100%", // Asegura que no exceda el ancho del contenedor
              maxHeight: "calc(100dvh - 64px)", // Limita la altura máxima al viewport menos el padding
              margin: "0 auto",
              background: "rgba(32, 35, 41, 0.95)",
              borderRadius: "16px",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(151, 206, 76, 0.2)",
              },
            }}
          >
            <Grid container>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(90deg, rgba(32, 35, 41, 0.8) 0%, transparent 100%)",
                    zIndex: 1,
                    transition: "opacity 0.3s ease",
                    "@media (min-width: 900px)": {
                      display: "none",
                    },
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={character?.image}
                  alt={character?.name}
                  sx={{
                    width: "100%",
                    height: { xs: "200px", sm: "300px", md: "100%" },
                    objectFit: "cover",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "scale(1.05)",
                      filter: "brightness(1.1) contrast(1.1)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <CardContent
                  sx={{
                    padding: { xs: "16px", sm: "24px", md: "32px" },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        marginBottom: "8px",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      }}
                    >
                      {statusIcon}
                      {character?.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                      }}
                    >
                      {character?.species}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <Chip
                      label={character?.status}
                      sx={{
                        backgroundColor: "rgba(151, 206, 76, 0.1)",
                        color: "#97ce4c",
                        border: "1px solid rgba(151, 206, 76, 0.3)",
                      }}
                    />
                    <Chip
                      label={character?.gender}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      marginTop: "16px",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.5)",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          marginBottom: "4px",
                          fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                        }}
                      >
                        Last known location
                      </Typography>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                        }}
                      >
                        {location}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.5)",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          marginBottom: "4px",
                          fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                        }}
                      >
                        First seen in
                      </Typography>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                        }}
                      >
                        {episode}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Fade>
      )}
    </Box>
  );
}

export default CharacterCard;
