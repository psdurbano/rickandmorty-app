import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function Header() {
  const headerStyle = {
    background: "#3B3E43",
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={headerStyle} elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: isSmallScreen ? "60px" : "100px",
                  padding: "16px",
                }}
              />
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
