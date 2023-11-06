import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { css } from "@emotion/react";
import Header from "./Header";

function CharacterCard() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${id}`
        );
        const data = await response.json();
        setCharacter(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCharacter();
  }, [id]);

  if (!character) {
    return <div>Cargando...</div>;
  }

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

  const statusIcon =
    character.status === "Alive" ? (
      <CheckCircleOutlineIcon
        sx={{
          fontSize: "inherit",
          color: "green",
          verticalAlign: "middle",
          marginRight: "4px",
        }}
      />
    ) : character.status === "Dead" ? (
      <RadioButtonUncheckedIcon
        sx={{
          fontSize: "inherit",
          color: "red",
          verticalAlign: "middle",
          marginRight: "4px",
        }}
      />
    ) : (
      <HelpOutlineIcon
        sx={{
          fontSize: "inherit",
          color: "gray",
          verticalAlign: "middle",
          marginRight: "4px",
        }}
      />
    );

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
        <Card
          sx={cardStyles}
          style={{
            borderRadius: "50px",
            width: "100%",
            maxWidth: "700px",
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
              width: "50%",
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
                  fontSize: "2.4em",
                  color: "#fff",
                }}
                css={cardNameStyles}
              >
                {character.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: "bold", fontSize: "1.6em", color: "#fff" }}
              >
                {statusIcon}
                {character.status} － {character.species}
              </Typography>
            </>
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ color: "#ccc", fontSize: "1em" }}
              >
                Last known location:
                <br /> {character.location.name}
              </Typography>
            </>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default CharacterCard;
