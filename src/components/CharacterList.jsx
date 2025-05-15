import { css } from "@emotion/react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Fade,
  Skeleton
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

async function fetchLocation(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.name;
  } catch (error) {
    return "";
  }
}

async function fetchEpisode(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.name;
  } catch (error) {
    return "";
  }
}

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const observerRef = useRef(null);
  
  // Nuevos estados para los filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  const buildApiUrl = (page = 1) => {
    let url = `https://rickandmortyapi.com/api/character?page=${page}`;
    const params = [];
    if (statusFilter && statusFilter !== "all") params.push(`status=${encodeURIComponent(statusFilter)}`);
    if (speciesFilter && speciesFilter !== "all") params.push(`species=${encodeURIComponent(speciesFilter)}`);
    if (genderFilter && genderFilter !== "all") params.push(`gender=${encodeURIComponent(genderFilter)}`);
    if (searchTerm && searchTerm.trim() !== "") params.push(`name=${encodeURIComponent(searchTerm)}`);
    if (params.length > 0) {
      url += `&${params.join("&")}`;
    }
    return url;
  };

  const loadMoreCharacters = async () => {
    try {
      setLoading(true);
      const nextPage = Math.floor(characters.length / 20) + 1;
      const apiUrl = buildApiUrl(nextPage);
      const characterData = await fetchData(apiUrl);
      if (characterData && characterData.results) {
        setCharacters((prev) => [...prev, ...characterData.results]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Resetear personajes al cambiar filtros o búsqueda
  useEffect(() => {
    const fetchFilteredCharacters = async () => {
      setLoading(true);
      setCharacters([]); // Limpiar personajes actuales
      const apiUrl = buildApiUrl(1);
      const characterData = await fetchData(apiUrl);
      if (characterData && characterData.results) {
        setCharacters(characterData.results);
      } else {
        setCharacters([]);
      }
      setLoading(false);
    };
    fetchFilteredCharacters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, speciesFilter, genderFilter, searchTerm]);

  // Ya no es necesario filtrar en frontend, solo setear los personajes
  useEffect(() => {
    setFilteredCharacters(characters);
  }, [characters]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreCharacters();
      }
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locationPromises = characters.map(async (character) => {
        const locationURL = character.location.url;
        const locationName = await fetchLocation(locationURL);
        return { id: character.id, name: locationName };
      });
      const locationData = await Promise.all(locationPromises);
      setLocations([...locations, ...locationData]);
    };

    const fetchEpisodes = async () => {
      const episodePromises = characters.map(async (character) => {
        const episodeURL = character.episode[0];
        const episodeName = await fetchEpisode(episodeURL);
        return { id: character.id, name: episodeName };
      });
      const episodeData = await Promise.all(episodePromises);
      setEpisodes([...episodes, ...episodeData]);
    };

    fetchLocations();
    fetchEpisodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters]);

  const searchBarStyles = css`
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    z-index: 999;
    padding: 8px;
    background: #202329;
    border-bottom: 2px solid #97ce4c;
    box-shadow: 0 2px 10px rgba(151, 206, 76, 0.2);
    transition: all 0.3s ease;

    &:hover {
      border-bottom: 2px solid #b7e66e;
      box-shadow: 0 2px 15px rgba(151, 206, 76, 0.3);
    }
  `;

  const mainContainerStyles = css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: #202329;
  `;

  const headerContainerStyles = css`
    flex: none;
    background: #202329;
  `;

  const scrollContainerStyles = css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    margin-top: 8px;
  `;

  // Efecto para el botón de scroll to top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Efecto para filtrar personajes
  useEffect(() => {
    const filtered = characters.filter((character) => {
      const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || character.status.toLowerCase() === statusFilter.toLowerCase();
      // Normalización para species
      const speciesValue = (character.species || "").toLowerCase().replace(/\s+/g, "");
      const filterValue = (speciesFilter || "").toLowerCase().replace(/\s+/g, "");
      let matchesSpecies = true;
      if (speciesFilter !== "all") {
        if (filterValue === "unknown") {
          matchesSpecies = speciesValue === "unknown" || speciesValue === "";
        } else {
          matchesSpecies = speciesValue === filterValue;
        }
      }
      const matchesGender = genderFilter === "all" || character.gender.toLowerCase() === genderFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesSpecies && matchesGender;
    });
    setFilteredCharacters(filtered);
  }, [searchTerm, statusFilter, speciesFilter, genderFilter, characters]);

  return (
    <Box sx={{ 
      background: "#202329", 
      minHeight: "100vh", 
      overflowX: "hidden",
      width: "100%",
      maxWidth: "100vw"
    }}>
      <Header />
      <Box css={searchBarStyles}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: "12px", sm: "16px" },
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: { xs: "12px", sm: "16px" },
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              maxWidth: { xs: "100%", sm: "300px" },
              width: "100%",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                color: "#fff",
                height: { xs: "40px", sm: "48px" },
                "& fieldset": {
                  borderColor: "rgba(151, 206, 76, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#97ce4c",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#97ce4c",
                },
              },
              "& .MuiInputBase-input": {
                color: "#fff",
                fontSize: { xs: "14px", sm: "16px" },
                padding: { xs: "8px 12px", sm: "12px 16px" },
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: "12px", sm: "16px" },
              flexWrap: "wrap",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <FormControl
              sx={{
                minWidth: { xs: "100%", sm: "140px" },
                width: { xs: "100%", sm: "auto" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  color: "#fff",
                  height: { xs: "40px", sm: "48px" },
                  "& fieldset": {
                    borderColor: "rgba(151, 206, 76, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#97ce4c",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#97ce4c",
                  },
                },
              }}
            >
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={{
                  color: "#fff",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "8px 12px", sm: "12px 16px" },
                  "& .MuiSelect-icon": {
                    color: "#97ce4c",
                  },
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="alive">Alive</MenuItem>
                <MenuItem value="dead">Dead</MenuItem>
                <MenuItem value="unknown">Unknown</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{
                minWidth: { xs: "100%", sm: "140px" },
                width: { xs: "100%", sm: "auto" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  color: "#fff",
                  height: { xs: "40px", sm: "48px" },
                  "& fieldset": {
                    borderColor: "rgba(151, 206, 76, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#97ce4c",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#97ce4c",
                  },
                },
              }}
            >
              <Select
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
                displayEmpty
                sx={{
                  color: "#fff",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "8px 12px", sm: "12px 16px" },
                  "& .MuiSelect-icon": {
                    color: "#97ce4c",
                  },
                }}
              >
                <MenuItem value="all">All Species</MenuItem>
                <MenuItem value="human">Human</MenuItem>
                <MenuItem value="alien">Alien</MenuItem>
                <MenuItem value="humanoid">Humanoid</MenuItem>
                <MenuItem value="Mythological Creature">Mythological</MenuItem>
                <MenuItem value="unknown">Unknown</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{
                minWidth: { xs: "100%", sm: "140px" },
                width: { xs: "100%", sm: "auto" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  color: "#fff",
                  height: { xs: "40px", sm: "48px" },
                  "& fieldset": {
                    borderColor: "rgba(151, 206, 76, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#97ce4c",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#97ce4c",
                  },
                },
              }}
            >
              <Select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                displayEmpty
                sx={{
                  color: "#fff",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "8px 12px", sm: "12px 16px" },
                  "& .MuiSelect-icon": {
                    color: "#97ce4c",
                  },
                }}
              >
                <MenuItem value="all">All Genders</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="genderless">Genderless</MenuItem>
                <MenuItem value="unknown">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        mt="100px"
        p={{ xs: "16px", sm: "24px" }}
        flexDirection="column"
        alignItems="center"
        sx={{
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          boxSizing: "border-box"
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          width="100%"
          gap={{ xs: "8px", sm: "16px" }}
          sx={{
            maxWidth: "100%",
            boxSizing: "border-box"
          }}
        >
          {loading ? (
            // Skeleton loading
            Array.from(new Array(6)).map((_, index) => (
              <Card
                key={index}
                sx={{
                  width: { xs: "100%", sm: "500px" },
                  height: "180px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(32, 35, 41, 0.95)",
                  border: "none",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="40%"
                  height="100%"
                  sx={{ borderRadius: "16px 0 0 16px" }}
                />
                <CardContent>
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="70%" />
                </CardContent>
              </Card>
            ))
          ) : (
            <Fade in={true}>
              <Box 
                display="flex" 
                flexWrap="wrap" 
                justifyContent="center" 
                gap={{ xs: "8px", sm: "16px" }}
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box"
                }}
              >
                {filteredCharacters.map((character) => {
                  let statusIcon;
                  if (character.status === "Alive") {
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
                  } else if (character.status === "Dead") {
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
                    <Link
                      to={`/character/${character.id}`}
                      style={{ textDecoration: 'none', width: { xs: "100%", sm: "auto" } }}
                      key={character.id}
                    >
                      <Card
                        sx={{
                          position: "relative",
                          background: "rgba(32, 35, 41, 0.95)",
                          border: "none",
                          overflow: "hidden",
                          borderRadius: "16px",
                          width: { xs: "100%", sm: "500px" },
                          height: "180px",
                          display: "flex",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                          backdropFilter: "blur(10px)",
                          animation: "cardAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                          "@keyframes cardAppear": {
                            from: {
                              opacity: 0,
                              transform: "translateY(20px)",
                            },
                            to: {
                              opacity: 1,
                              transform: "translateY(0)",
                            },
                          },
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(151, 206, 76, 0.2)",
                            "& .card-image": {
                              transform: "scale(1.1)",
                              filter: "brightness(1.1) contrast(1.1)",
                            },
                            "& .card-content": {
                              background: "rgba(32, 35, 41, 0.98)",
                            },
                            "& .card-name": {
                              color: "#97ce4c",
                            },
                            "& .card-info": {
                              transform: "translateX(5px)",
                            },
                            "&::after": {
                              opacity: 1,
                            },
                          },
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(135deg, rgba(151, 206, 76, 0.1) 0%, transparent 50%, rgba(151, 206, 76, 0.05) 100%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            zIndex: 1,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: "40%",
                            overflow: "hidden",
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
                            }
                          }}
                        >
                          <CardMedia
                            component="img"
                            alt={character.name}
                            height="100%"
                            image={character.image}
                            className="card-image"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                              filter: "brightness(1) contrast(1)",
                            }}
                          />
                        </Box>
                        <CardContent
                          className="card-content"
                          sx={{
                            flex: 1,
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            background: "rgba(32, 35, 41, 0.95)",
                            transition: "all 0.3s ease",
                            position: "relative",
                            zIndex: 2,
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h5"
                              component="div"
                              className="card-name"
                              sx={{
                                transition: "all 0.3s ease",
                                position: "relative",
                                display: "inline-block",
                                fontWeight: 600,
                                fontSize: "1.2em",
                                color: "#fff",
                                marginBottom: "8px",
                                textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              {statusIcon}
                              {character.name}
                            </Typography>
                            <Typography
                              className="card-info"
                              sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                fontSize: "0.9em",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                transition: "all 0.3s ease",
                                textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              {character.species}
                            </Typography>
                          </Box>
                          <Box 
                            sx={{ 
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            <Box className="card-info" sx={{ transition: "all 0.3s ease" }}>
                              <Typography
                                sx={{
                                  color: "rgba(255, 255, 255, 0.5)",
                                  fontSize: "0.75em",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                  marginBottom: "2px",
                                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                Last known location
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#fff",
                                  fontWeight: "500",
                                  fontSize: "0.9em",
                                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                {character.location.name}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
      <Fade in={showScrollTop}>
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#3B3E43",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#4B4E53",
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      </Fade>
      <div ref={observerRef}></div>
    </Box>
  );
}

export default CharacterList;
