import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Link from "@mui/material/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textDecoration: "none",
  },
  navLinks: {
    "& > *:not(.lastLink)": {
      marginRight: "16px",
      textDecoration: "none",
    },
  },
  lastLink: {
    textDecoration: "none",
  },
}));

const Nav = () => {
  const classes = useStyles();

  const navLinks = (
    <div className={classes.navLinks}>
      <Link color="inherit" href="/users">
        Users
      </Link>
      <Link color="inherit" href="/tags">
        Tags
      </Link>
      <Link className={classes.lastLink} color="inherit" href="/posts">
        Posts
      </Link>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link className={classes.lastLink} color="inherit" href="/">
              My Blog
            </Link>
          </Typography>
          {navLinks}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Nav;
