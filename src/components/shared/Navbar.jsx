import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { FaSearch, FaDatabase, FaSun, FaMoon } from "react-icons/fa";
import IconButton from "@material-ui/core/IconButton";
import { useTheme } from "@material-ui/core";

const useStyle = makeStyles({
  root: {
    position: "static",
  },
  toolbar: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  brand: {
    color: "inherit",
    textDecoration: "none",
  },
  navItems: {
    marginLeft: "auto",
  },
});

export default function Navbar({ toggleTheme }) {
  const classes = useStyle();
  const theme = useTheme();

  return (
    <AppBar className={classes.root}>
      <Container>
        <Toolbar className={classes.toolbar}>
          <Typography
            className={classes.brand}
            variant="h6"
            component={Link}
            to="/all"
          >
            Mat Manga
          </Typography>
          <Box className={classes.navItems}>
            <Button
              color="inherit"
              startIcon={<FaDatabase />}
              component={Link}
              to="/all"
            >
              All Manga
            </Button>
            <Button
              color="inherit"
              startIcon={<FaSearch />}
              component={Link}
              to="/search"
            >
              Search
            </Button>
            <IconButton color="inherit" onClick={toggleTheme}>
              {theme.palette.type === "dark" ? <FaSun /> : <FaMoon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
