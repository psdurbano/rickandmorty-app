import { css } from "@emotion/react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
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
  const observerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadMoreCharacters = async () => {
    try {
      const nextPage = Math.floor(characters.length / 20) + 1;
      const characterData = await fetchData(
        `https://rickandmortyapi.com/api/character?page=${nextPage}`
      );
      if (characterData && characterData.results) {
        setCharacters([...characters, ...characterData.results]);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const cardStyles = css`
    transition: transform 0.5s ease, box-shadow 0.5s ease, filter 0.5s ease;
    filter: grayscale(100%);
    transform-origin: center;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      filter: grayscale(0%);
    }
  `;

  const cardNameStyles = css`
    transition: color 0.3s ease;
    &:hover {
      color: orange;
    }
  `;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setFilteredCharacters(
      characters.filter((character) =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, characters]);

  return (
    <div>
      <Header />
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        mt="150px"
        p="16px"
        flexDirection="column"
        alignItems="center"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "80%",
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search character..."
            style={{
              padding: "10px 10px 10px 10px",
              margin: "16px",
              borderRadius: "50px",
              border: "1px solid #ccc",
              width: "100%",
              transition: "border-color 0.3s",
              "&:hover": {
                borderColor: "#aaa",
              },
            }}
          />
        </div>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          width="100%"
        >
          {filteredCharacters.map((character) => {
            const location = locations.find((loc) => loc.id === character.id);
            const episode = episodes.find((ep) => ep.id === character.id);

            let statusIcon;
            if (character.status === "Alive") {
              statusIcon = (
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: "inherit",
                    color: "green",
                    verticalAlign: "middle",
                    marginRight: "4px",
                  }}
                />
              );
            } else if (character.status === "Dead") {
              statusIcon = (
                <RadioButtonUncheckedIcon
                  sx={{
                    fontSize: "inherit",
                    color: "red",
                    verticalAlign: "middle",
                    marginRight: "4px",
                  }}
                />
              );
            } else {
              statusIcon = (
                <HelpOutlineIcon
                  sx={{
                    fontSize: "inherit",
                    color: "gray",
                    verticalAlign: "middle",
                    marginRight: "4px",
                  }}
                />
              );
            }

            return (
              <Card
                key={character.id}
                sx={cardStyles}
                style={{
                  borderRadius: "50px",
                  margin: "16px",
                  width: "500px",
                  height: "220px",
                  display: "flex",
                  backgroundColor: "#3B3E43",
                }}
              >
                <CardMedia
                  component="img"
                  alt={character.name}
                  height="100%"
                  image={character.image}
                  style={{
                    width: "40%",
                    objectFit: "cover",
                    borderRadius: "50px",
                  }}
                />
                <CardContent
                  style={{
                    flex: 1,
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.8em",
                        color: "#fff",
                      }}
                      css={cardNameStyles}
                    >
                      <Link
                        to={`/character/${character.id}`}
                        style={{ color: "#fff", textDecoration: "none" }}
                      >
                        {character.name}
                      </Link>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: "bold", color: "#fff" }}
                    >
                      {statusIcon}
                      {character.status} － {character.species}
                    </Typography>
                  </>
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: "#ccc" }}
                    >
                      Last known location:
                      <br /> {location?.name}
                    </Typography>
                  </>
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: "#ccc" }}
                    >
                      First seen in:
                      <br /> {episode?.name}
                    </Typography>
                  </>
                </CardContent>
              </Card>
            );
          })}
        </Box>
        <div ref={observerRef}></div>
      </Box>
    </div>
  );
}

export default CharacterList;
