import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import HomeSharpIcon from "@material-ui/icons/HomeSharp";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";

import { logout } from "../../functions/auth";
import { logOutUser } from "../../redux/actions/authAction";

import bgNav from "../../assets/img/bg-nav.png";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    alignItems: "center",
    backgroundColor: "#fff",
  },
  toolbarContainer: {
    maxWidth: theme.breakpoints.width("md"),
    width: "100%",
  },
  toolBarMargin: {
    ...theme.mixins.toolbar,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",

    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    color: "#000",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "flex",
    color: "#000",
    // [theme.breakpoints.up("md")]: {
    //   display: "flex",
    // },
  },
  // sectionMobile: {
  //   display: "flex",
  //   [theme.breakpoints.up("md")]: {
  //     display: "none",
  //   },
  // },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const Header = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state) => state.user);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout().then((res) => {
      dispatch(logOutUser());
      localStorage.removeItem("firstLogin");
      history.push("/signin");
    });
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={handleMenuClose}
        component={Link}
        to={`/${user.username}`}
      >
        Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>Save</MenuItem>
      <MenuItem onClick={handleMenuClose}>Setting</MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" className={classes.appBar} elevation={1}>
        <Toolbar className={classes.toolbarContainer}>
          <Typography
            component={Link}
            to="/"
            className={classes.title}
            variant="h6"
            noWrap
          >
            <img src={bgNav} alt="instagram" style={{ marginTop: 10 }} />
          </Typography>
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit">
              <HomeSharpIcon />
            </IconButton>

            <IconButton color="inherit">
              <EmailOutlinedIcon />
            </IconButton>
            <IconButton color="inherit">
              <ExploreOutlinedIcon />
            </IconButton>
            <IconButton color="inherit">
              <FavoriteBorderOutlinedIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user.avatar.url ? (
                <Avatar
                  alt={user.username}
                  src={user.avatar.url}
                  className={classes.avatar}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {renderMenu}
      <section className={classes.toolBarMargin} />
    </div>
  );
};

export default Header;
