import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";

function Header() {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const headerStyles = css`
    background: #202329;
    border-bottom: 2px solid #97ce4c;
    box-shadow: 0 2px 10px rgba(151, 206, 76, 0.2);
    transition: all 0.3s ease;

    &:hover {
      border-bottom: 2px solid #b7e66e;
      box-shadow: 0 2px 15px rgba(151, 206, 76, 0.3);
    }
  `;

  const logoStyles = css`
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

    &:hover {
      transform: scale(1.1) translateY(-2px);
      filter: drop-shadow(0 4px 8px rgba(151, 206, 76, 0.3));
    }
  `;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" css={headerStyles} elevation={0}>
        <Toolbar 
          sx={{ 
            minHeight: isSmallScreen ? "70px" : "85px",
            padding: isSmallScreen ? "0 16px" : "0 24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            background: "linear-gradient(180deg, rgba(32, 35, 41, 0.95) 0%, rgba(32, 35, 41, 0.98) 100%)",
          }}
        >
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={logo}
              alt="Logo"
              css={logoStyles}
              style={{
                height: isSmallScreen ? "45px" : "60px",
                padding: "4px",
              }}
            />
          </Link>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: isSmallScreen ? "70px" : "85px" }} />
    </Box>
  );
}

export default Header;
